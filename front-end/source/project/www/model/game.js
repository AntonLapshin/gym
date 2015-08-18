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
                    self.player.updateValue(self.player.private.energy, self.player.private.energy() - value);
                });

                c.on('record', function (record) {
                    var name = Refs.getExercise(record.exerciseId).name();
                    var weight = record.weight;
                    var title = record.type === 'wr'
                        ? c.strings.mesWorldRecord()
                        : c.strings.mesPresonalRecord();
                    var mes = record.type === 'wr'
                        ? c.strings.mesWorldRecordDesc()
                        : c.strings.mesPersonalRecordDesc();
                    mes = c.format(mes, name, weight);
                    toastr['success'](mes, title);

                    if (record.type === 'wr') {
                        var newWr = {
                            _id: self.player._id,
                            value: record.weight
                        };

                        $.grep(Refs.exercises, function (e) {
                            return e._id === record.exerciseId;
                        })[0].wr = newWr;
                    }
                    else {
                        var ex =
                            $.grep(self.player.public.exercises, function(e){
                                return e._id === record.exerciseId;
                            });
                        if (ex.length > 0)
                            ex[0].pr = record.weight;
                        else
                            self.player.public.exercises.push({ _id: record.exerciseId, pr: record.weight});
                    }
                });

                c.on('money.earn', function (value) {
                    toastr['success']('+' + value + '<span class="glyphicon glyphicon-usd"></span>', c.strings.earnMoney());
                    self.player.updateValue(self.player.private.money, self.player.private.money() + value);
                });

                c.on('server.response', function(data){
                    if (data.newAchievements && data.newAchievements.length > 0){
                        $.each(data.newAchievements, function(i, id){
                            var achievement = Refs.getAchievements()[id];
                            toastr['success'](achievement.name(), c.strings.achNew());
                            self.player.private.achievements.push(id);
                        });
                        c.fire('achievements.update');
                    }
                });

                return $.when.apply(this, [this.player.load(), Refs.load(this.player)]);
            }

        }
    });