var Db = require('../db'),
    Player = require('./player'),
    $ = require('jquery-deferred');

var achList = [
    // 80 kg
    function(player, result){
        return result.energyRest === 0;
    },
    function(player, result){
        return false;
    },
    function(player, result){
        return result.exerciseId === 0 && result.weight === 80 && result.repeats > 0;
    }
];

module.exports = {
    handler: function(result){
        return $.Deferred(function(defer){
            if (!result.result) {
                defer.resolve(result);
                return;
            }

            var player = result.player;
            result = result.result;
            result.newAchievements = [];
            var achievements = player.private.achievements;
            achList.forEach(function(ach, i){
                if (achievements.indexOf(i) !== -1)
                    return;

                if (ach(player, result)){
                    result.newAchievements.push(i);
                }
            });
            if (result.newAchievements.length > 0)
                Player.update(player._id, {
                    $pushAll: { 'private.achievements': result.newAchievements }
                }).then(function(){
                    defer.resolve(result);
                }, defer.reject);
            else
                defer.resolve(result);
        });
   }
};

function round(v) {
    return Math.round(v * 100) / 100;
}