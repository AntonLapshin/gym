var Db = require('../db'),
    Player = require('./player'),
    $ = require('jquery-deferred');

var achList = [
    // 80 kg
    function (player, result) {
        return player.private.energy === 0;
    },
    function (player, result) {
        return false;
    },
    function (player, result) {
        return result.exerciseId === 0 && result.weight === 80 && result.repeats > 0;
    }
];

module.exports = {
    handler: function (session, result) {
        var player = session.player;
        if (typeof result !== 'object' || result === player)
            return;

        result.newAchievements = [];
        var achievements = player.private.achievements;
        achList.forEach(function (ach, i) {
            if (achievements.indexOf(i) !== -1)
                return;

            if (ach(player, result)) {
                result.newAchievements.push(i);
                achievements.push(i);
            }
        });
        if (result.newAchievements.length > 0) {
            session.isDirty = true;
        }
    }
};

function round(v) {
    return Math.round(v * 100) / 100;
}