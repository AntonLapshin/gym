define(['jquery', 'server/server', 'plugins/component'], function ($, server, c) {

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
            return i % 2 == 0 ? c - 50 : c;
        }).join(',');
        return $.extend(
            { map: map },
            ref, player,
            { name: c.strings[c.format('manM{0}', view._id)]}
        );
    }

    function getExercise(id){
        var ownExercise = $.grep(_player.public.exercises, function (ex) {
            return ex._id === id;
        });
        var ownExerciseExists = ownExercise.length > 0;
        return $.extend(
            {
                name: c.strings[c.format('ex{0}name', id)],
                desc: c.strings[c.format('ex{0}desc', id)],
                img: c.format('components/workout/ex{0}.jpg', id),
                disabled: !ownExerciseExists
            },
            ownExerciseExists ? ownExercise[0] : {},
            _refs.exercises[id]
        );
    }

    function getGym( id){
        var ownGymExists = _player.private.gyms.indexOf(id) !== -1;
        return $.extend(
            {
                name: c.strings[c.format('gym{0}name', id)],
                desc: c.strings[c.format('gym{0}desc', id)],
                img: c.format('components/gyms/gym{0}.jpg', id),
                disabled: !ownGymExists
            },
            _refs.gyms[id]
        );
    }

    function getAchievement( id){
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
        getMuscles: function (isPrivate) {
            var maps = $.grep(_refs.muscles_view, function (m) {
                return m._id == _player.public.level();
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