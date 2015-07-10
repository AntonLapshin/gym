var Db = require('../../db'),
    Player = require('../../controllers/player'),
    GymDb = require('../../gymdb/gymdb'),
    PlayersCollection = require('../../gymdb/collections/players'),
    DateHelper = require('../../controllers/date');

//var updatePlayer = function()
//{
//    mongo.players.update(
//        { _id: PLAYER_ID_TEST },
//        {
//            $pushAll: { awards: [0, 1], factors: [1000, 1001, 1002], records: [
//                { _id: 0, value: 125, date: new Date(), isWR: false },
//                {_id: 1, value: 225, date: new Date(), isWR: true}
//            ] },
//            $set: { "body.0.power": 0.1, "body.1.power": 0.2, "body.3.power": 0.2, "body.4.power": 0.2,
//                "body.5.power": 0.3, "body.6.power": -0.1, "body.7.power": 0.1, "body.9.power": 0.1,
//                "body.10.power": 0.3,
//
//                "body.0.frazzle": 0.1, "body.1.frazzle": 0.5, "body.3.frazzle": 0.2, "body.4.frazzle": 0.9,
//                "body.5.frazzle": 1, "body.6.frazzle": 0.7, "body.7.frazzle": 0.1, "body.9.frazzle": 0.1,
//                "body.10.frazzle": 0.3
//            }
//        },
//        function()
//        {
//            callback();
//        }
//    );
//};

var PLAYER_ID_TEST = 0;
var PLAYER_ID_NOT_EXISTS = -1;
var PLAYER_NOT_CREATED = 99;

module.exports = {
    setUp: function (callback) {
        GymDb.init().then(GymDb.create, console.log).then(callback, console.log);
    },
    tearDown: function (callback) {
        GymDb.close().then(callback, console.log);
    },
    exists: function (test) {
        Player.exists(PLAYER_ID_TEST).then(function (_id) {
            test.equal(_id != null, true);
            test.done();
        });
    },
    notExists: function (test) {
        Player.exists(PLAYER_ID_NOT_EXISTS).then(function (_id) {
            test.equal(!_id, true);
            test.done();
        });
    },
    find: function (test) {
        var field = 'public';
        Player.find(PLAYER_ID_TEST, field).then(
            function (data) {
                test.equal(data != null, true);
                test.done();
            }
        );
    },
    top: function(test){
        Player.top().then(
            function (data) {
                test.equal(data != null, true);
                test.done();
            }
        );
    },
    create: function(test){
        Player.find(PLAYER_NOT_CREATED, 'public').then(
            function (publicInfo) {
                test.equal(publicInfo == undefined, true);
                return Player.create(PLAYER_NOT_CREATED);
            }
        ).then(
            function () {
                return Player.find(PLAYER_NOT_CREATED, 'public');
            }
        ).then(
            function (publicInfo) {
                test.equal(publicInfo != undefined, true);
                test.done();
            }
        );
    },
    incMoney: function(test){
        var money = 5;
        var privateInfo1 = null;

        Player.find(PLAYER_ID_TEST, 'private').then(
            function (privateInfo) {
                privateInfo1 = privateInfo;
                return Player.incMoney(PLAYER_ID_TEST, money);
            }
        ).then(
            function () {
                return Player.find(PLAYER_ID_TEST, 'private');
            }
        ).then(
            function (privateInfo2) {
                test.equal(privateInfo2.money, PlayersCollection.START_MONEY + money);
                test.done();
            }
        );
    },
    decEnergy: function(test){
        var value = 5;
        var privateInfo1 = null;

        Player.find(PLAYER_ID_TEST, 'private').then(
            function (privateInfo) {
                privateInfo1 = privateInfo;
                return Player.decEnergy(PLAYER_ID_TEST, value);
            }
        ).then(
            function () {
                return Player.find(PLAYER_ID_TEST, 'private');
            }
        ).then(
            function (privateInfo2) {
                test.equal(privateInfo2.energy, privateInfo1.energy - value);
                test.done();
            }
        );
    },
    frazzle: function(test){
        var exercise = Db.getRefs().exercises[0];
        Player.find(PLAYER_ID_TEST, 'public.body').then(
            function (body) {
                return Player.frazzle(PLAYER_ID_TEST, body, exercise, 0.5);
            }
        ).then(
            function () {
                return Player.find(PLAYER_ID_TEST, 'body');
            }
        ).then(
            function (body) {
                test.equal(body[2].frazzle, 0.25);
                test.equal(body[2].stress, 0.25);
                test.equal(body[4].frazzle, 0.4);
                test.equal(body[4].stress, 0.4);
                test.equal(body[5].frazzle, 0.15);
                test.equal(body[5].stress, 0.15);
                test.equal(body[6].frazzle, 0.5);
                test.equal(body[6].stress, 0.5);

                return Player.frazzle(PLAYER_ID_TEST, body, exercise, 1);
            }
        ).then(
            function () {
                return Player.find(PLAYER_ID_TEST, 'public.body');
            }
        ).then(
            function (body) {
                test.equal(body[2].frazzle, 0.75);
                test.equal(body[2].stress, 0.75);
                test.equal(body[4].frazzle, 1);
                test.equal(body[4].stress, 1);
                test.equal(body[5].frazzle, 0.45);
                test.equal(body[5].stress, 0.45);
                test.equal(body[6].frazzle, 1);
                test.equal(body[6].stress, 1);

                test.done();
            }
        )
    },
    updateState: function(test){
        var exercise = Db.getRefs().exercises[0];
        Player.find(PLAYER_ID_TEST, 'public.body').then(
            function (body) {
                return Player.frazzle(PLAYER_ID_TEST, body, exercise, 0.5);
            }
        ).then(
            function () {
                return Player.find(PLAYER_ID_TEST, 'public.body');
            }
        ).then(
            function (body) {
                test.equal(body[2].frazzle, 0.25);
                test.equal(body[2].stress, 0.25);
                test.equal(body[4].frazzle, 0.4);
                test.equal(body[4].stress, 0.4);
                test.equal(body[5].frazzle, 0.15);
                test.equal(body[5].stress, 0.15);
                test.equal(body[6].frazzle, 0.5);
                test.equal(body[6].stress, 0.5);

                var now1 = new Date();
                DateHelper.addHours(now1, -1);

                return Player.update(PLAYER_ID_TEST, {$set: {'private.reg.lastUpdateTime': now1}});
            }
        ).then(
            function () {
                return Player.updateState(PLAYER_ID_TEST);
            }
        ).then(
            function () {
                return Player.find(PLAYER_ID_TEST, 'public.body');
            }
        ).then(
            function (body) {
                test.equal(body[2].frazzle, 0);
                test.equal(body[2].stress, 0.25);
                test.equal(body[4].frazzle, 0.1);
                test.equal(body[4].stress, 0.4);
                test.equal(body[5].frazzle, 0);
                test.equal(body[5].stress, 0.15);
                test.equal(body[6].frazzle, 0.2);
                test.equal(body[6].stress, 0.5);

                test.done();
            }
        )
    }
    //updateStateFix: function(test){
    //    var factor1 = Factor.get(1000);
    //    var factor2 = Factor.get(2000);
    //    var factor3 = Factor.get(3000);
    //
    //    var expireDate = DateHelper.addHours(new Date(), 1);
    //
    //    Db.players.update(
    //        {_id: PLAYER_ID_TEST0},
    //        {
    //            $pushAll: {
    //                factors: [
    //                    {
    //                        _id: factor1._id,
    //                        expire: expireDate
    //                    },
    //                    {
    //                        _id: factor2._id,
    //                        expire: expireDate
    //                    },
    //                    {
    //                        _id: factor3._id,
    //                        expire: expireDate
    //                    }
    //                ]
    //            }
    //        },
    //        function (err) {
    //            var now1 = new Date();
    //            now1 = DateHelper.addHours(now1, -5);
    //
    //            Player.update(PLAYER_ID_TEST0,
    //                {
    //                    $set: {
    //                        'private.reg.lastUpdateTime': now1,
    //                        'private.reg.lastFixTime': now1
    //                    }
    //                }
    //            ).then(
    //                function () {
    //                    return Player.find(PLAYER_ID_TEST0, 'body');
    //                }
    //            ).then(
    //                function (body) {
    //                    var exercise = Db.dics.exercises[0];
    //                    return Player.setFrazzle(PLAYER_ID_TEST0, body, exercise, 1);
    //                }
    //            ).then(
    //                function () {
    //                    return Player.updateState(PLAYER_ID_TEST0);
    //                }
    //            ).then(
    //                function () {
    //                    return Player.find(PLAYER_ID_TEST0, 'private');
    //                }
    //            ).then(
    //                function (privateInfo) {
    //                    test.equal(privateInfo.reg.rest, 0);
    //                    test.equal(privateInfo.reg.food, 0);
    //                    test.equal(privateInfo.reg.stimulant, 0);
    //
    //                    test.done();
    //                }
    //            );
    //        }
    //    );
    //}
};
