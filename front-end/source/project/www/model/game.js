define(['jquery', 'model/player', 'server/server', 'plugins/component'], function ($, Player, server, c) {

    var _events = {};

    return {
        player: null,
        refs: null,
        init: function(){
            this.player = new Player();
            var deferPlayer = this.player.load();
            var self = this;
            var deferRefs = server.loadRefs().then(function(data){
                self.refs = data;
            });
            return $.when.apply(this, [deferPlayer, deferRefs]);
        },
        getMuscles: function(){
            var self = this;
            var maps = $.grep(this.refs.muscles_view, function(m){
                return m._id == self.player.public.level();
            })[0].front;

            var muscles = $.map(maps, function(view){
                var ref = $.grep(self.refs.muscles, function(m) { return m._id === view._id; })[0];
                var player = $.grep(self.player.body, function(p) { return p._id === view._id; })[0];
                var map = $.map(view.map.split(','), function(c, i) { return i % 2 == 0 ? c - 50 : c; }).join(',');
                return $.extend(
                    { map: map },
                    ref, player,
                    { name: c.strings[c.format('manM{0}', view._id)] }
                );
            });

            return muscles;
        },
        getExercises: function(gymId){
            var self = this;
            var exercisesIds = this.refs.gyms[gymId].exercises;
            return $.map(exercisesIds, function(id){
                return $.extend(
                    {
                        name: c.strings[c.format('ex{0}name', id)],
                        desc: c.strings[c.format('ex{0}desc', id)],
                        img: c.format('components/workout/ex{0}.jpg', id)
                    },
                    self.refs.exercises[id]
                );
            });
        },
        getGyms: function(){
            var self = this;
            return $.map(this.player.gyms, function(id){
                return $.extend(
                    {
                        name: c.strings[c.format('gym{0}name', id)],
                        desc: c.strings[c.format('gym{0}desc', id)]
                    },
                    self.refs.gyms[id]
                );
            });
        },
        on: function(event, el){
            if (!_events.hasOwnProperty(event)) {
                _events[event] = [];
            }
            _events[event].push(el);
        },
        fire: function(event, args){
            if (_events.hasOwnProperty(event)) {
                $.each(_events[event], function(i, el){
                    el(args);
                });
            }
        }
    }
});