var Db = require('../db'),
    DateHelper = require('../controllers/date'),
    $ = require('jquery-deferred');

var PERIOD = 1,
    TIMER = 60,
    WEIGHT_MIN = 20,
    WEIGHT_MAX = 60,
    WEIGHT_DELTA = 2.5,
    MAX_DELAY = 3,
    MONEY = 5;

var MES_TOOEARLY = "Слишком рано, попробуйте позже",
    MES_NOTSTARTED = "Работа не начата",
    MES_STARTEDYET = "Работа уже начата",
    MES_TIMEISUP = "Время истекло",
    MES_NOWEIGHT = "Не выбран вес";

module.exports = {

    get: {
        handler: function (session) {
            var player = session.player,
                now = new Date(),
                job = player.private.job;

            return $.Deferred(function (defer) {
                if (now < job.nextTime) {
                    defer.reject(MES_TOOEARLY);
                    return;
                }

                if (job.time) {
                    if (now <= getDeadline(job.time)) {
                        defer.reject(MES_STARTEDYET);
                        return;
                    }
                }

                job.weight = (Math.floor(Math.random() * (WEIGHT_MAX - WEIGHT_MIN + 1)) + WEIGHT_MIN) * WEIGHT_DELTA;
                job.time = now;
                job.nextTime = DateHelper.setNextTime(now, PERIOD);
                session.isDirty = true;
                defer.resolve(job.weight);
            });
        }
    },

    complete: {
        handler: function (session) {
            var player = session.player;
            var job = player.private.job;

            return $.Deferred(function (defer) {
                if (!job.time) {
                    defer.reject(MES_NOTSTARTED);
                    return;
                }

                var deadline = getDeadline(job.time);
                job.weight = null;
                job.time = null;

                if (new Date() >= deadline) {
                    defer.reject(MES_TIMEISUP);
                    return;
                }

                player.private.money += MONEY;
                session.isDirty = true;
                defer.resolve({
                    earn: MONEY,
                    type: 'job'
                });
            });
        }
    },

    PERIOD: PERIOD,
    TIMER: TIMER,
    MONEY: MONEY,
    WEIGHT_MIN: WEIGHT_MIN * WEIGHT_DELTA,
    WEIGHT_MAX: WEIGHT_MAX * WEIGHT_DELTA,

    MES_TOOEARLY: MES_TOOEARLY,
    MES_NOTSTARTED: MES_NOTSTARTED,
    MES_STARTEDYET: MES_STARTEDYET,
    MES_TIMEISUP: MES_TIMEISUP,
    MES_NOWEIGHT: MES_NOWEIGHT
};

function getDeadline(time) {
    return DateHelper.addSeconds(new Date(time), TIMER + MAX_DELAY);
}

