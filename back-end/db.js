var Mongo = require('mongodb'),
    $ = require('jquery-deferred');

var _db = null,
    _collections = {},
    _references = {};

$.handle = function(err, data, defer){
    if (err)
        defer.reject(err);
    else {
        defer.resolve(data);
    }
};

module.exports = {
    init: function (options, collNames, refNames) {
        return this.connect(options)
            .then(function () {
                return module.exports.getCollections(collNames);
            })
            .then(function () {
                return loadReferences(refNames)
            })
    },
    connect: function (options) {
        var dbInstance = new Mongo.Db(
            options.database,
            new Mongo.Server(
                options.host,
                options.port,
                {auto_reconnect: true},
                {}
            )
        );

        return $.Deferred(function (defer) {
            dbInstance.open(function (err, db) {
                if (err)
                    defer.reject(err);
                else {
                    _db = db;
                    auth(options).then(function () {
                        defer.resolve();
                    });
                }
            });
        });
    },
    clearCollections: function (names) {
        var defers = [];
        names.forEach(function (name) {
            defers.push(clearCollection(name));
        });

        return $.when.apply($, defers);
    },
    getCollections: function (names) {
        var defers = [];
        names.forEach(function (name) {
            defers.push(getCollection(name));
        });

        return $.when.apply($, defers);
    },
    insert: function (coll, value) {
        if (typeof coll === 'string')
            coll = _collections[coll];

        return $.Deferred(function (defer) {
            coll.insert(value, function (err, value) {
                if (err)
                    defer.reject(err);
                else
                    defer.resolve(value);
            });
        });
    },
    update: function (coll, id, updateClause) {
        if (typeof coll === 'string')
            coll = _collections[coll];

        return $.Deferred(function (defer) {
            coll.update({ _id: id}, updateClause, function(err, value){
                $.handle(err, value, defer);
            });
        });
    },
    remove: function (coll, id) {
        if (typeof coll === 'string')
            coll = _collections[coll];

        return $.Deferred(function (defer) {
            coll.remove({ _id: id}, function(err, value){
                if (err)
                    defer.reject(err);
                else
                    defer.resolve(value);
            });
        });
    },
    exists: function (coll, id) {
        if (typeof coll === 'string')
            coll = _collections[coll];

        return $.Deferred(function (defer) {
            coll.findOne({ _id: id }, { _id: 1}, function(err, value){
                if (err)
                    defer.reject(err);
                else
                    defer.resolve(value);
            });
        });
    },
    find: function (coll, id, shown) {
        if (typeof coll === 'string')
            coll = _collections[coll];

        var shownBase = shown;
        if (typeof shown === 'string') shown = [shown];
        var target = {};
        for (var i = 0; i < shown.length; i++) target[shown[i]] = 1;

        return $.Deferred(function (defer) {
            coll.findOne({ _id: id }, target, function (err, data) {
                if (err)
                    defer.reject(err);
                else {
                    if (data == null) defer.resolve(null);
                    else if (typeof shownBase === 'string')
                        defer.resolve(data[shownBase]);
                    else
                        defer.resolve(data);
                }
            });
        });
    },
    ensureIndex: function (coll, index) {
        if (typeof coll === 'string')
            coll = _collections[coll];

        return $.Deferred(function (defer) {
            if (index == undefined) {
                defer.resolve();
                return;
            }

            coll.ensureIndex(index, function (err, value) {
                if (err)
                    defer.reject(err);
                else
                    defer.resolve(value);
            });
        });
    },
    getRefs: function () {
        return _references;
    },
    getDb: function () {
        return _db;
    },
    getColl: function (name) {
        return _collections[name];
    },
    grep: function(array, callback){
        var res = [];
        array.forEach(function(item){
            if (callback(item))
                res.push(item);
        });
        return res;
    },
    addClause: function(clause, type, object){
        if (!clause[type]){
            clause[type] = {};
        }
        for(var name in object){
            clause[type][name] = object[name];
        }
        return clause;
    }
};

function auth(options) {
    return $.Deferred(function (defer) {
        _db.authenticate(options.username, options.password, function (err, value) {
            if (err)
                defer.reject(err);
            else
                defer.resolve(value);
        });
    });
}

function loadReference(name) {
    return getAllValues(name).then(function (result) {
        _references[name] = result;
    });
}

function loadReferences(names) {
    var defers = [];
    names.forEach(function (name) {
        defers.push(loadReference(name));
    });

    return $.when.apply($, defers);
}

function getCollection(name) {
    return $.Deferred(function (defer) {
        _db.collection(name, function (err, value) {
            if (err)
                defer.reject(err);
            else {
                _collections[name] = value;
                defer.resolve(value);
            }
        });
    });
}

function getAllValues(coll) {
    if (typeof coll === 'string')
        coll = _collections[coll];

    return $.Deferred(function (defer) {
        coll.find({$query: {}, $orderby: {_id: 1}}).toArray(function (err, value) {
            if (err)
                defer.reject(err);
            else
                defer.resolve(value);
        });
    });
}

function clearCollection(coll) {
    if (typeof coll === 'string')
        coll = _collections[coll];

    return $.Deferred(function (defer) {
        if (coll === undefined) {
            defer.resolve();
            return;
        }
        coll.remove(function (err, value) {
            if (err)
                defer.reject(err);
            else
                defer.resolve(value);
        });
    });
}
