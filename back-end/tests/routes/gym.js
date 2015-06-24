var Db = require('../../db'),
    Player = require('../../controllers/player'),
    GymDb = require('../../gymdb/gymdb'),
    PlayersCollection = require('../../gymdb/collections/players'),
    Gym = require('../../routes/gym');

var PLAYER_ID_TEST = 0;
var GYM = 0;
var EXERCISE = 0;
var session = {player: {id: PLAYER_ID_TEST}};

module.exports = {
    setUp: function (callback) {
        GymDb.create().then(function () {
            GymDb.init().then(callback, console.log);
        }, console.log);
    },
    tearDown: function (callback) {
        GymDb.close();
        callback();
    },
    getExercisePower: function (test) {
        var exercise = Db.getRefs().exercises[2];
        var body = null;

        Player.find(session.player.id, 'body').then(
            function (data) {
                body = data;
                return Player.find(session.player.id, 'public');
            }
        ).then(
            function (publicInfo) {
                var totalPower = Gym.getExercisePower(body, publicInfo, exercise);
                test.equal(totalPower, 334);
                test.done();
            }
        );
    },
    executeSuccessForce: function (test) {
        Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 90, 0).then(
            function (answer) {
                test.equal(answer.repeats, 34.39);
                test.equal(answer.repeatsMax, 34.39);
                test.equal(answer.energy, 5);

                return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 90, 0);
            }
        ).then(
            function (answer) {
                test.equal(answer.repeats, 34.02);
                test.equal(answer.repeatsMax, 34.02);
                test.equal(answer.energy, 5);

                return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 90, 0);
            }
        ).then(
            function (answer) {
                test.equal(answer.repeats, 33.63);
                test.equal(answer.repeatsMax, 33.63);
                test.equal(answer.energy, 5);

                test.done();
            }
        );
    },
    executeSuccess: function (test) {
        Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 35, 12).then(
            function (answer) {
                test.equal(answer.repeats, 12);
                test.equal(answer.repeatsMax, 54.48);
                test.equal(answer.energy, 2);

                test.done();
            }
        );
    },
    executeWarmup: function (test) {
        Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 100, 1).then(
            function (answer) {
                test.equal(answer.repeats, 1);
                test.equal(answer.repeatsMax, 31.16);
                test.equal(answer.energy, 1);

                test.done();
            }
        );
    },
    executeFailWeight: function (test) {
        Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 10, 12).then(
            function (answer) {
                test.equal(answer, Gym.MES_WEIGHT);
                return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 100, 12);
            }
        ).then(
            function (answer) {
                test.notEqual(answer, Gym.MES_WEIGHT);
                return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 33.231, 12);
            }
        ).then(
            function (answer) {
                test.equal(answer, Gym.MES_WEIGHT);
                test.done();
            });
    },
    executeFailRepeats: function (test) {
        Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 50, 500).then(
            function (answer) {
                test.equal(answer, Gym.MES_REPEATS_MAX);
                return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 50, -1);
            }
        ).then(
            function (answer) {
                test.equal(answer, Gym.MES_REPEATS_MIN);
                test.done();
            }
        );
    },
    executeFailLessOneRepeat: function (test) {
        Gym.execute(PLAYER_ID_TEST, 2, EXERCISE, 240, 1).then(
            function (answer) {
                test.equal(0 < answer.repeatsMax && answer.repeatsMax < 1, true);
                test.equal(0 < answer.repeats && answer.repeats < 1, true);
                test.equal(answer.energy, Db.getRefs().exercises[0].energy);
                test.done();
            }
        );
    },
    executeFailEnergy: function (test) {
        Player.update(PLAYER_ID_TEST, {$set: {'private.energy': Db.getRefs().exercises[EXERCISE].energy - 1}}).then(
            function () {
                return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 50, 0);
            }
        ).then(
            function (answer) {
                test.equal(answer, Gym.MES_ENERGY);
                return Player.update(PLAYER_ID_TEST, {$set: {'private.energy': 1}});
            }
        ).then(
            function () {
                return Gym.execute(PLAYER_ID_TEST, 2, EXERCISE, 160, 10);
            }
        ).then(
            function (answer) {
                test.equal(answer, Gym.MES_ENERGY);
                return Player.update(PLAYER_ID_TEST, {$set: {'private.energy': PlayersCollection.ENERGY_MAX}});
            }
        ).then(
            function () {
                test.done();
            }
        );
    }
};