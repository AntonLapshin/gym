var Db = require('../db'),
    PlayersCollection = require('../gymdb/collections/players'),
    $ = require('jquery-deferred');

var LIMIT_TOP_PLAYERS = 100;

module.exports = {
    create: function(id){
        return Db.insert('players', PlayersCollection.newPlayer(id, 0));
    },
    update: function(id, setClause){
        return Db.update('players', id, setClause);
    },
    exists: function(id){
        return Db.exists('players', id);
    },
    find: function(id, shown){
        return Db.find('players', id, shown);
    },
    remove: function(id){
        return Db.remove('players', id);
    },
    top: function(){
        return $.Deferred(function (defer) {
            Db.getColl('players').find({$query: {}, $orderby: {'public.level': -1}}, {_id: 1, public: 1})
                .limit(LIMIT_TOP_PLAYERS)
                .toArray(function (err, data) {
                    $.handle(err, data, defer);
                });
        });
    },
    incMoney: function(id, money){
        return module.exports.update(id, {$inc: {'private.money': money}});
    },
    decMoney: function(id, money){
        return module.exports.update(id, {$inc: {'private.money': money == undefined ? 0 : -money}});
    },
    decEnergy: function(id, value){
        return module.exports.update(id, {$inc: {'private.energy': -value}});
    },
    frazzle: function(playerId, body, exercise, effect){
        var setClause = {};

        for (var i = 0; i < exercise.body.length; i++) {
            var muscleExercise = exercise.body[i];
            var muscleBody = body[muscleExercise._id];
            var f = muscleBody.frazzle + muscleExercise.stress * effect;
            if (f > 1) f = 1;
            f = round(f);
            var e = muscleBody.stress + muscleExercise.stress * effect;
            if (e > 1) e = 1;
            e = round(e);
            setClause['private.body.' + muscleExercise._id + '.frazzle'] = f;
            setClause['private.body.' + muscleExercise._id + '.stress'] = e;
        }

        return module.exports.update(playerId, {$set: setClause});
    }
};

function round(v) {
    return Math.round(v * 100) / 100;
}