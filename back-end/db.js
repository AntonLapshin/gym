var Mongo = require('mongodb'),
    $ = require('jquery-deferred');

var _db = null,
    _collections = {},
    _references = {};

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
