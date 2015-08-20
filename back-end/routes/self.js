var Db = require('../db'),
    DateHelper = require('../controllers/date'),
    PlayersCollection = require('../gymdb/collections/players'),
    Player = require('../controllers/player'),
    $ = require('jquery-deferred');

var UPDATE_PERIOD = 0.5, //5
    CHECK_LEVELUP_PERIOD = 4,
    REG_FRAZZLE_PER_HOUR = 10,//0.3
    REG_ENERGY = 10,// 0.3
    REG_ENERGY_PER_HOUR = REG_ENERGY * PlayersCollection.ENERGY_MAX;

module.exports = {
    get: {
        handler: function(session){
            return $.Deferred(function(defer){
                var player = session.player;
                var now = new Date();
                var reg = player.private.reg;
                var minUpdateTime = DateHelper.addMinutesClone(reg.lastUpdateTime, UPDATE_PERIOD);
                if (minUpdateTime > now) {
                    defer.resolve(player);
                    return;
                }

                update(player);
                levelUp(player);
                session.isDirty = true;
                defer.resolve(player);
            });
        }
    },
    setFriends: {
        params: {
            friends: {
                required: true,
                parseMethod: parseInt
            }
        },
        handler: function (session, params){
            return $.Deferred(function(defer){
                session.player.private.friends = params.friends;
                session.isDirty = true;
                defer.resolve(true);
            });
        }
    },
    getPlayer: {
        params: {
            playerId: {
                required: true,
                parseMethod: parseInt
            }
        },
        handler: function (session, params){
            return Player.find(params.playerId, ['id', 'public']);
        }
    }
};

// Resting: regenerating energy and muscles (energy->energy_max, frazzle->0)
// todo: decreasing food and stimulant factors
function update(player) {
    var now = new Date();
    //var interval = DateHelper.intervalHours(now - player.private.reg.lastUpdateTime);
    var interval = DateHelper.intervalHours(Date.parse(now) - Date.parse(player.private.reg.lastUpdateTime));
    var frazzleDecrease = $.round(REG_FRAZZLE_PER_HOUR * interval);
    var energyValue = Math.round(player.private.energy + REG_ENERGY_PER_HOUR * interval);

    if (energyValue > PlayersCollection.ENERGY_MAX)
        energyValue = PlayersCollection.ENERGY_MAX;

    player.private.energy = energyValue;
    player.private.reg.lastUpdateTime = now;

    for (var i = 0; i < player.private.body.length; i++) {
        var muscle = player.private.body[i];
        muscle.frazzle = $.round(muscle.frazzle - frazzleDecrease);
        if (muscle.frazzle < 0)
            muscle.frazzle = 0;
    }
}

// Calculate prob of level increase. Returns clause.
function levelUp(player) {
    var getPowerAll = function () {
        var muscles = Db.getRefs().muscles;
        var powerAll = 0;
        for (var i = 0; i < muscles.length; i++) {
            powerAll += muscles[i].power;
        }
        return powerAll;
    };

    var now = new Date();
    var minFixTime = DateHelper.addHoursClone(player.private.reg.lastCheckLevelUpTime, CHECK_LEVELUP_PERIOD);
    if (minFixTime > now)
        return false;

    var powerAll = getPowerAll();
    var stress = 0;

    for (var i = 0; i < player.private.body.length; i++) {
        var muscleBody = player.private.body[i];
        var muscles = Db.getRefs().muscles;
        var muscle = muscles[muscleBody._id];

        stress += muscle.power * muscleBody.stress / powerAll;
    }

    // todo: add rest, food and stimulant factors
    //var p = stress * setClause['private.reg.rest'] * setClause['private.reg.food'] * setClause['private.reg.stimulant'];
    var levelUp = Math.random() < stress * 0.5;
    if (levelUp) {
        player.private.level++;
        for (i = 0; i < player.private.body.length; i++) {
            //player.private.body[i].frazzle = 0;
            player.private.body[i].stress = 0;
        }
    }
}