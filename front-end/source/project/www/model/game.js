define(['jquery',
        'bootbox',
        'toastr',
        'model/player',
        'model/refs',
        'plugins/component'],
    function ($, bootbox, toastr, Player, Refs, c) {

        return {
            player: null,
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

                c.on('record', function (args) {
                    var name = Refs.getExercise(args._id).name;
                    var weight = args.weight;
                    var title = args.type === 'WR' ? c.strings.mesWorldRecord : c.strings.mesPresonalRecord;
                    var mes = args.type === 'WR' ? c.strings.mesWorldRecordDesc : c.strings.mesPersonalRecordDesc;
                    mes = c.format(mes(), name(), weight);
                    toastr['success'](mes, title());
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
                    }
                });

                return $.when.apply(this, [this.player.load(), Refs.load(this.player)]);
            }

        }
    });