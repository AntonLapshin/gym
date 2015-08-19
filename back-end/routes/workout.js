var Db = require('../db'),
    $ = require('jquery-deferred');

var WEIGHT_MIN = 20;
var REPEATS_MIN = 0;
var REPEATS_MAX = 200;
var COEFF_POWER = 4;
var COEFF_FRAZZLE = 10;

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
            gymId: {required: true, parseMethod: parseInt},
            exerciseId: {required: true, parseMethod: parseInt},
            weight: {required: true, parseMethod: parseFloat},
            repeats: {required: true, parseMethod: parseInt}
        },
        handler: function (session, params) {
            var player = session.player;
            var gymId = params.gymId;
            var exerciseId = params.exerciseId;
            var weight = params.weight;
            var repeats = params.repeats;

            return $.Deferred(function (defer) {
                var gymRef = Db.getRefs().gyms[gymId];
                if (gymRef.exercises.indexOf(exerciseId) == -1) {
                    defer.reject(MES_EXERCISE);
                    return;
                }

                var exRef = Db.getRefs().exercises[exerciseId];
                var maxWeight = exRef.max * gymRef.weight;

                if (weight < WEIGHT_MIN || maxWeight < weight) {
                    defer.reject(MES_WEIGHT);
                    return;
                }
                if (repeats < REPEATS_MIN) {
                    defer.reject(MES_REPEATS_MIN);
                    return;
                }
                if (repeats > REPEATS_MAX) {
                    defer.reject(MES_REPEATS_MAX);
                    return;
                }

                var power = getExercisePower(player.private.body, player.public, exRef);
                if (power < weight) {
                    if (exRef.energy > player.private.energy){
                        defer.reject(MES_ENERGY);
                        return;
                    }
                    player.private.energy -= exRef.energy;
                    session.isDirty = true;
                    defer.resolve({
                        repeatsMax: power / weight,
                        repeats: power / weight,
                        energy: exRef.energy,
                        records: []
                    });
                    return;
                }

                var mass = player.public.level * 1.33 + 40;
                var k1 = 1 - weight / power;
                var repeatsMax = $.round(k1 / 0.03 + k1 * k1 * 35 + 1);
                var k2 = weight * repeatsMax - weight * repeatsMax * (k1 + 0.25) + weight;
                while (k2 < 0) k2 += weight;
                var effMax = k2 / (mass * 15);

                var repeatsPlan = repeats > 0 ? repeats : repeatsMax;
                var repeatsFact = $.round(repeatsPlan < repeatsMax ? repeatsPlan : repeatsMax);
                var effFact = (repeatsFact / repeatsPlan) * effMax;

                var energyFact = Math.ceil((repeatsFact / repeatsMax) * exRef.energy);
                if (energyFact > player.private.energy) {
                    defer.reject(MES_ENERGY);
                    return;
                }

                // ---------------------------------------------------------------------

                var result = {
                    exerciseId: exerciseId,
                    weight: weight,
                    repeatsMax: repeatsMax,
                    repeats: repeatsFact,
                    energy: energyFact,
                    records: []
                };

                if (repeatsFact >= 1) {

                    // Personal Record
                    var playerEx = $.grep(player.public.exercises, function (ex) {
                        return ex._id === exerciseId;
                    });
                    playerEx = playerEx.length > 0 ? playerEx[0] : null;
                    var pr = playerEx ? playerEx.pr : 0;
                    if (weight > pr) {
                        if (playerEx){
                            playerEx.pr = weight;
                        }
                        else {
                            player.public.exercises.push({
                                _id: exerciseId, pr: weight
                            });
                        }

                        result.records.push('pr');
                    }

                    // Absolute Record
                    var wr = exRef.wr;
                    if (weight > (wr ? wr.value : 0)) {
                        exRef.wr = {
                            value: weight,
                            _id: player._id
                        };

                        Db.update('exercises', exerciseId, {
                            $set: {
                                wr: exRef.wr
                            }
                        });
                        result.records.push('wr');
                    }
                }

                player.private.energy -= energyFact;
                setFrazzle(player, exRef, effFact);
                session.isDirty = true;

                defer.resolve(result);
            });
        }
    }
};

function getExercisePower(body, pub, exRef) {
    //TODO: stimulants
    var level = pub.level;
    var totalPower = 0;
    for (var i = 0; i < exRef.body.length; i++) {
        var muscleEx = exRef.body[i];
        var muscleBody = body[muscleEx._id];
        var muscleRef = Db.getRefs().muscles[muscleEx._id];
        var power = level * muscleRef.power * muscleEx.stress / COEFF_POWER;
        power = power - power * muscleBody.frazzle / COEFF_FRAZZLE;
        totalPower += power;
    }
    totalPower = totalPower * exRef.coeff + exRef.power;
    return totalPower;
}

function setFrazzle(player, exRef, effect){
    exRef.body.forEach(function(muscleExercise){
        var muscleBody = player.private.body[muscleExercise._id];
        var f = muscleBody.frazzle + muscleExercise.stress * effect;
        if (f > 1) f = 1;
        var s = muscleBody.stress + muscleExercise.stress * effect;
        if (s > 1) s = 1;
        player.private.body[muscleExercise._id].frazzle = $.round(f);
        player.private.body[muscleExercise._id].stress = $.round(s);
    });
}