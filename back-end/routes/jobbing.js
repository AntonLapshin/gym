var Db = require('../db'),
    Player = require('../controllers/player'),
    DateHelper = require('../controllers/date'),
    $ = require('jquery-deferred');


var JOBBING_PERIOD = 1,
    JOBBING_TIMER = 60,
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
    JOBBING_PERIOD: JOBBING_PERIOD,
    JOBBING_TIMER: JOBBING_TIMER,

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
    start: start,
    complete: complete
};

function clearJobbing(session) {
    session.player.jobbing = {isStarted: false, startedTime: null, weight: null};
}

function initJobbing(session) {
    if (session.player.jobbing == undefined) {
        clearJobbing(session);
    }
}

function getExpiredTime(session) {
    var time = new Date(session.player.jobbing.startedTime);
    return DateHelper.addSeconds(time, JOBBING_TIMER + MAX_DELAY);
}

function setNextTime(id, value) {
    return Player.update(id, {$set: {"jobbing.nextTime": value}});
}

function get(session) {
    initJobbing(session);
    var playerId = session.player.id,
        now = new Date(),
        jobbing = session.player.jobbing;

    return $.Deferred(function (defer) {
        if (jobbing.isStarted == true && jobbing.startedTime) {
            if (now <= getExpiredTime(session)) {
                defer.resolve(MES_STARTEDYET);
                return;
            }

            jobbing.isStarted = false;
            jobbing.startedTime = null;
            jobbing.weight = null;
        }

        Player.find(playerId, 'jobbing').then(
            function (playerJobbing) {
                var now = new Date();
                if (now < playerJobbing.nextTime) {
                    defer.resolve(MES_TOOEARLY);
                    return;
                }
                if (!jobbing.weight) {
                    jobbing.weight = (Math.floor(Math.random() * (WEIGHT_MAX - WEIGHT_MIN + 1)) + WEIGHT_MIN) * WEIGHT_DELTA;
                }
                defer.resolve(jobbing.weight);
            }
        );
    });
}

function start (session) {
    initJobbing(session);
    var playerId = session.player.id;
    var jobbing = session.player.jobbing;

    return $.Deferred(function (defer) {
        if (jobbing.isStarted == true) {
            defer.resolve(MES_STARTEDYET);
            return;
        }
        if (jobbing.weight == null) {
            defer.resolve(MES_NOWEIGHT);
            return;
        }

        var now = new Date();
        jobbing.isStarted = true;
        jobbing.startedTime = now;
        setNextTime(playerId, DateHelper.setNextTime(now, JOBBING_PERIOD));
        defer.resolve();
    });
}

function complete (session) {
    var playerId = session.player.id;
    var jobbing = session.player.jobbing;

    return $.Deferred(function (defer) {
        if (jobbing.isStarted == false) {
            defer.resolve(MES_NOTSTARTED);
            return;
        }
        if (new Date() >= getExpiredTime(session)) {
            clearJobbing(session);
            defer.resolve(MES_TIMEISUP);
            return;
        }
        clearJobbing(session);
        Player.incMoney(playerId, MONEY).then(
            function () {
                defer.resolve(MONEY);
            }
        );
    });
}
