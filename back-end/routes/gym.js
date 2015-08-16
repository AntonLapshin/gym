var Db = require('../db'),
    Player = require('../controllers/player'),
    $ = require('jquery-deferred');

var WEIGHT_MIN = 20;
var REPEATS_MIN = 0;
var REPEATS_MAX = 200;

var COEFF_POWER = 4;
var COEFF_FRAZZLE = 10;
//var COEFF_BODYPOWER = 8;

var MES_WEIGHT = "Wrong weight",
    MES_REPEATS_MAX = "Repeats number is too big",
    MES_REPEATS_MIN = "Do at least one repeat",
    MES_ENERGY = "No enough energy",
    MES_EXERCISE = "Exercise is not available";

module.exports = {
    MES_WEIGHT: MES_WEIGHT,
    MES_REPEATS_MAX: MES_REPEATS_MAX,
    MES_REPEATS_MIN: MES_REPEATS_MIN,
    MES_ENERGY: MES_ENERGY,
    MES_EXERCISE: MES_EXERCISE,

    execute: {
        params: {
            gymId: { required: true, parseMethod: parseInt },
            exerciseId: { required: true, parseMethod: parseInt },
            weight: { required: true, parseMethod: parseInt },
            repeats: { required: true, parseMethod: parseInt }
        },
        handler: function(session, params) {
            var playerId = session.auth.id;
            var gymId = params.gymId;
            var exerciseId = params.exerciseId;
            var weight = params.weight;
            var repeats = params.repeats;

            return $.Deferred(function (defer) {
                var gym = Db.getRefs().gyms[gymId];
                if (gym.exercises.indexOf(exerciseId) == -1) {
                    defer.resolve(MES_EXERCISE);
                    return;
                }

                var exercise = Db.getRefs().exercises[exerciseId];

                if (weight < WEIGHT_MIN) {
                    defer.resolve(MES_WEIGHT);
                    return;
                }
                if (repeats < REPEATS_MIN) {
                    defer.resolve(MES_REPEATS_MIN);
                    return;
                }
                if (repeats > REPEATS_MAX) {
                    defer.resolve(MES_REPEATS_MAX);
                    return;
                }

                Player.find(playerId, ['public', 'private']).then(
                    function (player) {
                        var power = getExercisePower(player.private.body, player.public, exercise);
                        if (power < weight) {
                            defer.resolve({repeatsMax: power / weight, repeats: power / weight, energy: exercise.energy});
                            return;
                        }

                        var mass = player.public.level * 1.33 + 40;
                        var k1 = 1 - weight / power;
                        var repeatsMax = round(k1 / 0.03 + k1 * k1 * 35 + 1);
                        var k2 = weight * repeatsMax - weight * repeatsMax * (k1 + 0.25) + weight;
                        while (k2 < 0) k2 += weight;
                        var effMax = k2 / (mass * 15);

                        var repeatsPlan = repeats > 0 ? repeats : repeatsMax;
                        var repeatsFact = round(repeatsPlan < repeatsMax ? repeatsPlan : repeatsMax);
                        var effFact = (repeatsFact / repeatsPlan) * effMax;

                        var energyFact = Math.ceil((repeatsFact / repeatsMax) * exercise.energy);
                        if (energyFact > player.private.energy) {
                            defer.resolve(MES_ENERGY);
                            return;
                        }

                        Player.frazzle(playerId, player.private.body, exercise, effFact).then(
                            function () {
                                return Player.decEnergy(playerId, energyFact);
                            }, defer.reject
                        ).then(
                            function () {
                                defer.resolve(
                                    {
                                        repeatsMax: repeatsMax,
                                        repeats: repeatsFact,
                                        energy: energyFact
                                    });
                            }, defer.reject
                        );
                    },
                    defer.reject
                );
            });
        }
    },

    getExercisePower: getExercisePower
};

function round(v) {
    return Math.round(v * 100) / 100;
}

function getExercisePower(playerBody, publicInfo, exercise) {
    //TODO: stimulants
    var level = publicInfo.level;
    var totalPower = 0;
    for (var i = 0; i < exercise.body.length; i++) {
        var muscleExercise = exercise.body[i];
        var muscleBody = playerBody[muscleExercise._id];
        var muscleInfo = Db.getRefs().muscles[muscleExercise._id];
        var power = level * muscleInfo.power * muscleExercise.stress / COEFF_POWER;
        //power = power + power * muscleBody.power / COEFF_BODYPOWER;
        power = power - power * muscleBody.frazzle / COEFF_FRAZZLE;
        totalPower += power;
    }
    totalPower = totalPower * exercise.coeff + exercise.power;
    return totalPower;
}