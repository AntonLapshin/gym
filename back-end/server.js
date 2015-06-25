var Express = require('express'),
    GymDb = require('./gymdb/gymdb'),
    $ = require('jquery-deferred');

var ERR_PARAMS = {message: "Parameters are wrong"};
var ERR_UNAUTH = {message: "Unauthorized request"};

function handler(req, res, route) {
    console.log(req.url);

    try {
        var auth = require('./routes/auth');
        if (route !== auth) {
            if (!auth.isAuth(req))
                throw ERR_UNAUTH;
        }
        var params = getParams(req, route);
        var session = req.session;
        route.handler(session, params)
            .then(function (answer) {
                if (answer == undefined)answer = true;
                console.log(answer);
                res.jsonp(answer);
            }, function (err) {
                console.log("error: " + JSON.stringify(err) + " url: " + req.url);
                res.jsonp(JSON.stringify(err));
            });
    }
    catch (err) {
        console.log("error: " + JSON.stringify(err) + " url: " + req.url);
        res.jsonp("error: " + JSON.stringify(err) + " url: " + req.url);
    }
}

function getParams(req, route) {
    var params = {};

    for (var name in route.params) {
        var meta = route.params[name];
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
        gym = require('./routes/gym'),
        job = require('./routes/job');

    return $.Deferred(function (defer) {
        try {
            GymDb.init().then(function () {
                app.get('/auth', function (req, res) {
                    handler(req, res, auth)
                });
                app.get('/refs', function (req, res) {
                    handler(req, res, refs)
                });
                app.get('/gym', function (req, res) {
                    handler(req, res, gym)
                });
                app.get('/job', function (req, res) {
                    handler(req, res, job)
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

