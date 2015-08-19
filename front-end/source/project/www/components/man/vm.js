define([
    'ko',
    'jquery',
    'text!./view.html',
    'c',
    'social/social',
    'model/refs',
    'model/player',
    'cs/muscleinfo/vm',
    'cs/sw/vm',
    'cs/ava/vm'
], function (ko, $, html, c, social, Refs, Player, muscleinfo, sw, ava) {

    function showFrazzleMap(vm) {
        var fr$ = $('<canvas class="frazzle" width="480px" height="550px"/>');
        if (!vm.frazzle$){
            vm.frazzle$ = fr$;
            vm.elem$.find('img.img-map').before(vm.frazzle$);
        }else {
            vm.frazzle$.after(fr$);
            vm.frazzle$.remove();
            vm.frazzle$ = fr$;
        }

        var context = vm.frazzle$[0].getContext('2d');
        $.each(vm.muscles(), function (j, m) {
            var map = m.map.split(',');
            context.beginPath();
            context.moveTo(map[0], map[1]);
            for (var i = 2; i < map.length - 1; i = i + 2) {
                context.lineTo(map[i], map[i + 1]);
            }

            context.closePath();
            context.fillStyle = c.format('rgba(255,0,0,{0})', m.frazzle() / 2);
            context.fill();
        });
    }

    function hideFrazzleMap(vm) {
        vm.frazzle$ && vm.frazzle$.remove();
        vm.frazzle$ = null;
    }

    function showMuscle(vm, m) {
        var hl$ = $('<canvas class="highlight" width="480px" height="550px"/>');
        if (!vm.highlight$){
            vm.highlight$ = hl$;
            vm.elem$.find('img.img-map').before(vm.highlight$);
        }else {
            vm.highlight$.after(hl$);
            vm.highlight$.remove();
            vm.highlight$ = hl$;
        }
        var context = vm.highlight$[0].getContext('2d');

        var muscles = $.grep(vm.muscles(), function (item) {
            return item._id === m._id;
        });

        $.each(muscles, function (j, m) {
            var map = m.map.split(',');
            context.beginPath();
            context.moveTo(map[0], map[1]);
            for (var i = 2; i < map.length - 1; i = i + 2) {
                context.lineTo(map[i], map[i + 1]);
            }
            context.closePath();
            context.fillStyle = 'rgba(0,255,0,.4)';
            context.fill();
        });
    }

    function hideMuscle(vm) {
        vm.highlight$ && vm.highlight$.remove();
        vm.highlight$ = null;
    }

    function ViewModel() {
        var self = this;

        this.strings = c.strings;
        this.src = ko.observable();
        this.muscles = ko.observableArray();
        this.click = function () {
            if (this.model().id == 0) // may be "0"
            {
                social.invite();
                return;
            }
            var url = social.getUserUrl(this.model().id);
            var win = window.open(url, '_blank');
            win.focus();
        };
        this.init = function () {
            ava('man').init();
            sw('man').init(true);
            muscleinfo('man').init();

            c.on('sw.switch', function (data) {
                if (data.name !== 'sw+man')
                    return;

                if (data.state)
                    showFrazzleMap(self);
                else
                    hideFrazzleMap(self);
            });

            c.on('player.updated', function (player) {
                self.set(player);
            });

            return self;
        };
        this.set = function (model) {
            this.model(model);
            this.src(c.format('components/man/{0}_front.png', model.public.level()));
            this.muscles(Refs.getMuscles(!!model.private));
            if (!model.private) {
                ava('man').set(model).show();
            }
            else {
                ava('man').hide();
                sw('man').show();
            }
            if (sw('man').get())
                showFrazzleMap(self);
            return self;
        };
        this.onLoad = function () {
            self.elem$.on('mouseenter', 'area', function (e) {
                var id = $(e.currentTarget).data('id');
                var muscle = self.muscles()[id];
                showMuscle(self, muscle);
            });
            self.elem$.on('mousemove', 'area', function (e) {
                var id = $(e.currentTarget).data('id');
                var muscle = self.muscles()[id];
                var pos = self.elem$.offset();
                muscle.x1 = e.clientX - pos.left;
                muscle.y1 = e.clientY - pos.top;
                muscleinfo('man').set(muscle).show();
            });
            self.elem$.on('mouseleave', 'area', function () {
                muscleinfo('man').hide();
                hideMuscle(self);
            });
            showFrazzleMap(self);
        };
        this.test = function () {
            //var player = new Player(5653333);
            //player.load().then(function(){
            //    self.init().set(player).show();
            //});
            require(['model/game'], function (game) {
                self.init().set(game.player).show();
            });
        };
    }

    return c.add(ViewModel, html, 'man');
});