var Db = require('../db'),
    $ = require('jquery-deferred');

var COLL_NAMES = ['exercises', 'gyms', 'muscles', 'muscles_view', 'players'],
    REF_NAMES = ['exercises', 'gyms', 'muscles', 'muscles_view'],
    REMOTE_TEST = {
        host: 'ds049631.mongolab.com',
        port: 49631,
        database: 'heroku_app34432390',
        username: 'gymdb-test',
        password: 'testtest'
    },
    INDEX = {
        'players': {'public.level': -1}
    };

module.exports = {
    init: function () {
        return Db.init(REMOTE_TEST, COLL_NAMES, REF_NAMES);
    },
    close: function () {
        Db.getDb().close();
    },
    create: function () {
        return Db.connect(REMOTE_TEST)
            .then(function () {
                return Db.getCollections(COLL_NAMES);
            })
            .then(function () {
                return Db.clearCollections(COLL_NAMES);
            })
            .then(function () {
                return createCollections();
            });
    },
    COLL_NAMES: COLL_NAMES,
    REF_NAMES: REF_NAMES,
    REMOTE_TEST: REMOTE_TEST
};

function createColl(name) {
    var values = require('./collections/' + name)[name];
    return Db.insert(name, values)
        .then(function () {
            return Db.ensureIndex(name, INDEX[name]);
        });
}

function createCollections() {
    var defers = [];
    COLL_NAMES.forEach(function (name) {
        defers.push(createColl(name));
    });
    return $.when.apply($, defers);
}
