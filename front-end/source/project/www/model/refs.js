define(['jquery', 'server/server', 'c'], function ($, server, c) {

    var _refs,
        _player;

    function getMuscle(view, isPrivate){
        var ref = $.grep(_refs.muscles, function (m) {
            return m._id === view._id;
        })[0];
        var player = isPrivate ? $.grep(_player.private.body, function (p) {
            return p._id === view._id;
        })[0] : {};
        var map = $.map(view.map.split(','), function (c, i) {
            if (i % 2 == 0 && c == 200){
                return 201;
            }
            if (i % 2 == 0 && c == 202){
                return 201;
            }
            return c;
        }).join(',');
        return $.extend(
            { map: map },
            ref, player,
            { name: c.strings[c.format('manM{0}', view._id)]}
        );
    }

    function getExercise(id){
        var ex = $.grep(_player.public.exercises, function(e){
            return e._id === id;
        });
        ex = ex.length > 0 ? ex[0] : {};
        return $.extend(
            {
                name: c.strings[c.format('ex{0}name', id)],
                desc: c.strings[c.format('ex{0}desc', id)],
                img: c.format('components/workout/ex{0}.jpg', id),
                disabled: false
            },
            _refs.exercises[id],
            ex
        );
    }

    function getGym(id){
        var available = false;
        var gym = _refs.gyms[id];
        if (_player.private.gyms.indexOf(id) !== -1)
            available = true;
        else {
            var conditions = gym.conditions;
            if (!conditions)
                available = true;
            else
                $.each(conditions, function(i, c){
                    if (_player.public.level >= c.level && _player.private.friends >= c.friends) {
                        available = true;
                        return false;
                    }
                });
        }
        return $.extend(
            {
                name: c.strings[c.format('gym{0}name', id)],
                desc: c.strings[c.format('gym{0}desc', id)],
                img: c.format('components/gyms/gym{0}.jpg', id),
                disabled: !available
            },
            gym
        );
    }

    function getAchievement(id){
        var ownAchievementExists = _player.private.achievements.indexOf(id) !== -1;
        return $.extend(
            {
                name: c.strings[c.format('ach{0}name', id)],
                desc: c.strings[c.format('ach{0}desc', id)],
                completed: ownAchievementExists
            },
            _refs.achievements[id]
        );
    }

    return {
        load: function (player) {
            var self = this;
            return server.loadRefs().then(function (data) {
                _refs = data;
                _player = player;
                $.extend(self, data);
            });
        },
        getMuscles: function (isPrivate, level) {
            var maps = $.grep(_refs.muscles_view, function (m) {
                return m._id == level();
            })[0].front;

            return $.map(maps, function (view) {
                return getMuscle(view, isPrivate);
            });
        },
        getExercise: getExercise,
        getExercises: function (gymId) {
            return $.map(_refs.gyms[gymId].exercises, function (id) {
                return getExercise(id);
            });
        },
        getGyms: function () {
            return $.map(_refs.gyms, function (gym) {
                return getGym(gym._id);
            });
        },
        getAchievements: function () {
            return $.map(_refs.achievements, function (achievement) {
                return getAchievement(achievement._id);
            });
        }
    }
});