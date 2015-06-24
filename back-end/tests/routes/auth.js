var Player = require('../../controllers/player'),
    GymDb = require('../../gymdb/gymdb'),
    Auth = require('../../routes/auth');

var PLAYER_ID = 0,
    PLAYER_ID_CREATED = 1,
    AUTH_KEY = '884e02e93401a63c16614681a2a82808',
    AUTH_CREATED_KEY = '71213ba4fd85d5e46f9dd3cdb3019e07',
    AUTH_KEY_WRONG = 'wrong';

module.exports = {
    setUp: function (callback) {
        GymDb.init().then(callback, console.log);
    },
    tearDown: function (callback) {
        GymDb.close();
        callback();
    },
    authSuccess: function (test) {
        var session = {},
            params = {
                playerId: PLAYER_ID,
                authKey: AUTH_KEY
            };

        Auth.handler(session, params).then(
            function (answer) {
                test.equal(answer, Auth.MES_SUCCESS);
                test.equal(session.player.id, PLAYER_ID);
                test.done();
            },
            console.log
        );
    },
    authFail: function (test) {
        var session = {},
            params = {
                playerId: PLAYER_ID,
                authKey: AUTH_KEY_WRONG
            };

        Auth.handler(session, params).then(
            function (answer) {
                test.equal(answer, Auth.ERR_AUTH_FAIL);
                test.done();
            },
            console.log
        );
    },
    authCreate: function (test) {
        var session = {},
            params = {
                playerId: PLAYER_ID_CREATED,
                authKey: AUTH_CREATED_KEY
            };

        Auth.handler(session, params).then(
            function (answer) {
                test.equal(answer, Auth.MES_SUCCESS);
                test.equal(session.player.id, PLAYER_ID_CREATED);

                return Player.find(PLAYER_ID_CREATED, '_id');
            },
            console.log
        ).then(
            function (_id) {
                test.equal(_id != undefined, true);
                return Player.remove(PLAYER_ID_CREATED);
            },
            console.log
        ).then(test.done, console.log);
    }
};
