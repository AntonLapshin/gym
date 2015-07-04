define(['jquery', 'toastr', 'model/player', 'server/server', 'plugins/component'], function ($, toastr, Player, server, c) {

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

            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": true,
                "progressBar": false,
                "positionClass": "toast-bottom-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "3000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

            this.on('energy.decrease', function(value){
                toastr['warning']('-' + value, c.strings.decEnergy());
            });

            this.on('record', function(args){
                var name = self.getExercise(args._id).name;
                var weight = args.weight;
                var title = args.type === 'WR' ? c.strings.mesWorldRecord : c.strings.mesPresonalRecord;
                var mes = args.type === 'WR' ? c.strings.mesWorldRecordDesc : c.strings.mesPersonalRecordDesc;
                mes = c.format(mes(), name(), weight);
                toastr['success'](mes, title());
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
        getExercise: function(id){
            var self = this;
            return $.extend(
                {
                    name: c.strings[c.format('ex{0}name', id)],
                    desc: c.strings[c.format('ex{0}desc', id)],
                    img: c.format('components/workout/ex{0}.jpg', id)
                },
                self.refs.exercises[id]
            );
        },
        getExercises: function(gymId){
            var self = this;
            var exercisesIds = this.refs.gyms[gymId].exercises;
            return $.map(exercisesIds, function(id){
                return self.getExercise(id);
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