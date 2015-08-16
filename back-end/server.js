var Express = require('express'),
    GymDb = require('./gymdb/gymdb'),
    $ = require('jquery-deferred');

var ERR_PARAMS = "Parameters are wrong";
var ERR_UNAUTH = "Unauthorized request";

function handler(req, res, route) {

    function rejectHandler(err){
        var answer = {
            error: err,
            url: req.url
        };
        console.log(JSON.stringify(answer));
        res.jsonp(JSON.stringify(answer));
    }

    function resolveHandler(result){
        var answer = {
            data: result || true,
            url: req.url
        };
        console.log(JSON.stringify(answer));
        res.jsonp(JSON.stringify(answer));
    }

    try {
        var auth = require('./routes/auth');
        var session = req.session;
        if (route !== auth) {
            if (!session.auth)
                throw ERR_UNAUTH;
        }
        var methodName = getMethodName(req, route);
        var method = route[methodName];
        if (!method){
            rejectHandler("Method " + methodName + " is not exists");
            return;
        }

        var params = getParams(req, method);
        method.handler(session, params)
            .then(resolveHandler, rejectHandler);
    }
    catch (err) {
        rejectHandler(err);
    }
}

function getMethodName(req, route) {
    for (var name in req.query) {
        if (name === 'method')
            return req.query[name];
    }
    return 'default';
}

function getParams(req, method) {
    var params = {};
    if (!method.params)
        return params;

    for (var name in method.params) {
        var meta = method.params[name];
        var value = req.query[name];
        if (meta.required && value === undefined)
            throw ERR_PARAMS;

        if (meta.parseMethod)
            value = meta.parseMethod(value);

        params[name] = value;
    }

    return params;
}

exports.start = function (port) {
    var app = Express();
    app.configure(function () {
        app.use(Express.compress());
        app.use(Express.cookieParser());
        app.use(Express.session({secret: 'iuBviX21'}));
    });

    var auth = require('./routes/auth'),
        refs = require('./routes/refs'),
        workout = require('./routes/workout'),
        job = require('./routes/job'),
        self = require('./routes/self'),
        top = require('./routes/top');

    return $.Deferred(function (defer) {
        try {
            GymDb.init().then(function () {
                app.get('/auth', function (req, res) {
                    handler(req, res, auth);
                });
                app.get('/refs', function (req, res) {
                    handler(req, res, refs);
                });
                app.get('/workout', function (req, res) {
                    handler(req, res, workout);
                });
                app.get('/job', function (req, res) {
                    handler(req, res, job);
                });
                app.get('/self', function (req, res) {
                    handler(req, res, self);
                });
                app.get('/top', function (req, res) {
                    handler(req, res, top);
                });
                app.listen(port);
                defer.resolve();
            });
        }
        catch (e) {
            defer.reject(e);
        }
    });
};

