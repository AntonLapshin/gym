var Db = require('../db'),
    Player = require('../controllers/player'),
    DateHelper = require('../controllers/date'),
    $ = require('jquery-deferred');


var PERIOD = 1,
    TIMER = 60,
    WEIGHT_MIN = 20,
    WEIGHT_MAX = 95,
    WEIGHT_DELTA = 2.5,
    MAX_DELAY = 3,
    MONEY = 5;

var MES_TOOEARLY = {message: "Слишком рано, попробуйте позже"},
    MES_NOTSTARTED = {message: "Работа не начата"},
    MES_STARTEDYET = {message: "Работа уже начата"},
    MES_TIMEISUP = {message: "Время истекло"},
    MES_NOWEIGHT = {message: "Не выбран вес"};

module.exports = {
    PERIOD: PERIOD,
    TIMER: TIMER,

    params: {
        method: {
            required: true
        }
    },

    MONEY: MONEY,
    WEIGHT_MIN: WEIGHT_MIN * WEIGHT_DELTA,
    WEIGHT_MAX: WEIGHT_MAX * WEIGHT_DELTA,

    MES_TOOEARLY: MES_TOOEARLY,
    MES_NOTSTARTED: MES_NOTSTARTED,
    MES_STARTEDYET: MES_STARTEDYET,
    MES_TIMEISUP: MES_TIMEISUP,
    MES_NOWEIGHT: MES_NOWEIGHT,

    setNextTime: setNextTime,
    get: get,
    complete: complete,

    handler: function (session, params) {
        if (params.method == 'get')
            return get(session);
        else if (params.method == 'complete')
            return complete(session);
        else
            return $.Deferred(function (defer) {
                defer.resolve({message: 'Invalid method'});
            });
    }
};

function getDeadline(session) {
    var time = new Date(session.auth.job.time);
    return DateHelper.addSeconds(time, TIMER + MAX_DELAY);
}

function setNextTime(id, value) {
    return Player.update(id, {$set: {"job.nextTime": value}});
}

function get(session) {
    var playerId = session.auth.id,
        now = new Date(),
        job = session.auth.job;

    return $.Deferred(function (defer) {
        if (job.time) {
            if (now <= getDeadline(session)) {
                defer.resolve(MES_STARTEDYET);
                return;
            }
        }

        Player.find(playerId, 'job').then(
            function (playerJob) {
                var now = new Date();
                if (now < playerJob.nextTime) {
                    defer.resolve(MES_TOOEARLY);
                    return;
                }
                job.weight = (Math.floor(Math.random() * (WEIGHT_MAX - WEIGHT_MIN + 1)) + WEIGHT_MIN) * WEIGHT_DELTA;
                job.time = now;
                setNextTime(playerId, DateHelper.setNextTime(now, PERIOD));
                defer.resolve(job.weight);
            }
        );
    });
}

function complete(session) {
    var playerId = session.auth.id;
    var job = session.auth.job;

    return $.Deferred(function (defer) {
        if (!job.time) {
            defer.resolve(MES_NOTSTARTED);
            return;
        }
        var deadline = getDeadline(session);
        job.weight = null;
        job.time = null;
        if (new Date() >= deadline) {
            defer.resolve(MES_TIMEISUP);
            return;
        }
        Player.incMoney(playerId, MONEY).then(
            function () {
                defer.resolve(MONEY);
            }
        );
    });
}
