var Db = require('../db'),
    DateHelper = require('./date'),
    PlayersCollection = require('../gymdb/collections/players'),
    $ = require('jquery-deferred');

var UPDATE_PERIOD = 5,
    CHECK_LEVELUP_PERIOD = 4,
    LIMIT_TOP_PLAYERS = 100,
    REG_FRAZZLE_PER_HOUR = 0.3,
    REG_ENERGY = 0.3,
    REG_ENERGY_PER_HOUR = REG_ENERGY * PlayersCollection.ENERGY_MAX;

module.exports = {
    create: create,
    update: update,
    exists: exists,
    find: find,
    remove: remove,
    top: top,
    incMoney: incMoney,
    decMoney: decMoney,
    decEnergy: decEnergy,
    frazzle: frazzle,
    updateState: updateState
};

function update(id, setClause) {
    return Db.update('players', id, setClause);
}

function remove(id) {
    return Db.remove('players', id);
}

function create(id) {
    var newPlayer = PlayersCollection.newPlayer(-1, 0);
    newPlayer._id = id;

    return Db.insert('players', newPlayer);
}

function exists(id) {
    return Db.exists('players', id);
}

function find(id, shown) {
    return Db.find('players', id, shown);
}

function top() {
    return $.Deferred(function (defer) {
        Db.getColl('players').find({$query: {}, $orderby: { 'public.level': -1 }}, { _id: 1 })
            .limit(LIMIT_TOP_PLAYERS)
            .toArray(function (err, data) {
                if (err)
                    defer.reject(err);
                else {
                    defer.resolve(data);
                }
        });
    });
}

function frazzle(playerId, body, exercise, effect) {
    var setClause = {};

    for (var i = 0; i < exercise.body.length; i++) {
        var muscleExercise = exercise.body[i];
        var muscleBody = body[muscleExercise._id];
        var f = muscleBody.frazzle + muscleExercise.stress * effect;
        if (f > 1) f = 1;
        f = round2(f);
        var e = muscleBody.stress + muscleExercise.stress * effect;
        if (e > 1) e = 1;
        e = round2(e);
        setClause['body.' + muscleExercise._id + '.frazzle'] = f;
        setClause['body.' + muscleExercise._id + '.stress'] = e;
    }

    return update(playerId, { $set: setClause });
}

function updateState(id) {
    return find(id, ['private', 'body', 'public']).then(
        function (player) {
            var setClause = getUpdateClause(player);
            if (setClause == null) {
                return $.Deferred(function(defer){
                    defer.resolve();
                });
            }

            setClause = getClauseAfterCheckLevelUp(player, setClause);
            return update(id, {$set: setClause});
        }
    );
}

function incMoney (id, money) {
    return update(id, { $inc: {'private.money': money } });
}

function decMoney (id, money) {
    return update(id, { $inc: {'private.money': money == undefined ? 0 : -money } });
}

function decEnergy (id, value) {
    return update(id, { $inc: { 'private.energy': -value } });
}

function round2(v) {
    return Math.round(v * 100) / 100;
}

// Resting: regenerating energy and muscles (energy->energy_max, frazzle->0)
function getUpdateClause(player) {

    var now = new Date();
    var reg = player.private.reg;
    var minUpdateTime = DateHelper.addMinutesClone(reg.lastUpdateTime, UPDATE_PERIOD);
    if (minUpdateTime > now) return null;

    var interval = DateHelper.intervalHours(now - reg.lastUpdateTime);

    var frazzleDecrease = round2(REG_FRAZZLE_PER_HOUR * interval);
    var energyValue = Math.round(player.private.energy + REG_ENERGY_PER_HOUR * interval);

    if (energyValue > PlayersCollection.ENERGY_MAX)
        energyValue = PlayersCollection.ENERGY_MAX;

    var setClause =
    {
        'private.energy': energyValue,
        'private.reg.lastUpdateTime': now
    };

    for (var i = 0; i < player.body.length; i++) {
        var muscle = player.body[i];
        muscle.frazzle = round2(muscle.frazzle - frazzleDecrease);
        if (muscle.frazzle < 0)muscle.frazzle = 0;

        setClause['body.' + i + '.frazzle'] = muscle.frazzle;
    }
    return setClause;
}

// Calculate prob of level increase. Returns clause.
function getClauseAfterCheckLevelUp(player, setClause) {
    var getPowerAll = function () {
        var muscles = Db.dics.muscles;
        var powerAll = 0;
        for (var i = 0; i < muscles.length; i++) {
            powerAll += muscles[i].power;
        }
        return powerAll;
    };

    var now = new Date();
    var reg = player.private.reg;
    var minFixTime = DateHelper.addHoursClone(reg.lastCheckLevelUpTime, CHECK_LEVELUP_PERIOD);
    if (minFixTime > now) return setClause;

    var powerAll = getPowerAll();
    var stress = 0;

    for (var i = 0; i < player.body.length; i++) {
        var muscleBody = player.body[i];
        var muscles = Db.dics.muscles;
        var muscle = muscles[muscleBody._id];

        stress += muscle.power * muscleBody.stress / powerAll;
    }

    //var p = stress * setClause['private.reg.rest'] * setClause['private.reg.food'] * setClause['private.reg.stimulant'];
    var p = stress * 0.5;
    if (Math.random() < p) {
        setClause['public.level'] = player.public.level + 1;
        for (i = 0; i < player.body.length; i++) {
            setClause['body.' + i + '.frazzle'] = 0;
            setClause['body.' + i + '.stress'] = 0;
        }
    }

    return setClause;
}
