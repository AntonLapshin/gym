define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'model/refs',
    'c/muscleinfo/vm',
    'c/sw/vm',
    'c/ava/vm'
], function (ko, $, html, component, Refs, muscleinfo, sw, ava) {

    function showFrazzleMap(vm) {
        vm.frazzle$ = $('<canvas class="frazzle" width="480px" height="550px"/>');
        vm.elem$.find('img.img-map').before(vm.frazzle$);
        var context = vm.frazzle$[0].getContext('2d');
        $.each(vm.muscles(), function (j, m) {
            var map = m.map.split(',');
            context.beginPath();
            context.moveTo(map[0], map[1]);
            for (var i = 2; i < map.length - 1; i = i + 2) {
                context.lineTo(map[i], map[i + 1]);
            }

            context.closePath();
            context.fillStyle = component.format('rgba(255,0,0,{0})', m.frazzle() / 2);
            context.fill();
        });
    }

    function hideFrazzleMap(vm) {
        vm.frazzle$.remove();
    }

    function showMuscle(vm, m){
        vm.highlight$ = $('<canvas class="highlight" width="480px" height="550px"/>');
        vm.elem$.find('img.img-map').before(vm.highlight$);
        var context = vm.highlight$[0].getContext('2d');

        var map = m.map.split(',');
        context.beginPath();
        context.moveTo(map[0], map[1]);
        for (var i = 2; i < map.length - 1; i = i + 2) {
            context.lineTo(map[i], map[i + 1]);
        }

        context.closePath();
        context.fillStyle = 'rgba(0,255,0,.4)';
        context.fill();
    }

    function hideMuscle(vm){
        vm.highlight$.remove();
    }

    function ViewModel() {
        var self = this;

        this.strings = component.strings;
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
        this.init = function (model) {
            this.update(model);

            return this;
        };
        this.update = function(model){
            this.model(model);
            this.src(component.format('components/man/{0}.png', model.public.level()));
            this.muscles(Refs.getMuscles(!!model.private));
            if (!model.private){
                ava('man').show().init(model.public);
            }else {
                sw('man').show().init().progress(function (state) {
                    if (state)
                        showFrazzleMap(self);
                    else
                        hideFrazzleMap(self);
                });
            }
        };
        this.loaded = function (elem$) {
            elem$.on('mouseenter', 'area', function(e){
                var id = $(e.currentTarget).data('id');
                var muscle = self.muscles()[id];
                showMuscle(self, muscle);
            });
            elem$.on('mousemove', 'area', function(e){
                var id = $(e.currentTarget).data('id');
                var muscle = self.muscles()[id];
                var pos = self.elem$.offset();
                muscle.x1 = e.clientX - pos.left;
                muscle.y1 = e.clientY - pos.top;
                muscleinfo('man').show().init(muscle);
            });
            elem$.on('mouseleave', 'area', function(){
                muscleinfo('man').hide();
                hideMuscle(self);
            });
            this.elem$ = elem$;
        };
        this.test = function () {
            //require(['model/player'], function(Player){
            //    var player = new Player(5653333);
            //    player.load();
            //    self.show().init(player);
            //});
            require(['model/game'], function(game){
                self.show().init(game.player);
            });
        };
    }

    return component.add(ViewModel, html, 'man');
});

//    <muscleinfo params="name: 'man'"></muscleinfo>