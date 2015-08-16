define(['jquery',
        'bootbox',
        'toastr',
        'model/player',
        'model/refs',
        'c'],
    function ($, bootbox, toastr, Player, Refs, c) {

        return {
            player: null,
            error: function(err){
                bootbox.alert(err);
            },
            init: function () {
                var self = this;

                this.player = new Player();

                bootbox.setDefaults(
                    {
                        backdrop: true,
                        onEscape: true
                    }
                );

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
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                };

                c.on('energy.decrease', function (value) {
                    toastr['warning']('-' + value + '<span class="glyphicon glyphicon-flash"></span>', c.strings.decEnergy());
                    self.player.updateValue(self.player.private.energy, self.player.private.energy() - 3);
                });

                c.on('record', function (approach) {
                    var name = Refs.getExercise(approach.exerciseId).name();
                    var weight = approach.weight;
                    var title = approach.result.record === 'WR'
                        ? c.strings.mesWorldRecord()
                        : c.strings.mesPresonalRecord();
                    var mes = approach.result.record === 'WR'
                        ? c.strings.mesWorldRecordDesc()
                        : c.strings.mesPersonalRecordDesc();
                    mes = c.format(mes, name, weight);

                    if (approach.result.record === 'WR'){
                        $.grep(Refs.exercises, function(e){
                            return e._id === approach.exerciseId;
                        })[0].wr = {
                            _id: self.player._id,
                            value: weight
                        }
                    }
                    else {
                        $.grep(self.player.public.exercises, function(e){
                            return e._id === approach.exerciseId;
                        })[0].pr = weight;
                    }

                    toastr['success'](mes, title);
                });

                c.on('money.earn', function (value) {
                    toastr['success']('+' + value + '<span class="glyphicon glyphicon-usd"></span>', c.strings.earnMoney());
                    self.player.updateValue(self.player.private.money, self.player.private.money() + value);
                });

                c.on('server.response', function(data){
                    if (data.achievement){
                        var id = data.achievement._id;
                        var achievement = Refs.getAchievements()[id];
                        toastr['success'](achievement.name(), c.strings.achNew());
                        self.player.private.achievements.push(id);
                        c.fire('achievements.update');
                    }
                });

                return $.when.apply(this, [this.player.load(), Refs.load(this.player)]);
            }

        }
    });