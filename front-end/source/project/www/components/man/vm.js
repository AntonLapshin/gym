define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/game',
    'maphilight',
    'c/muscleinfo/vm',
    'c/sw/vm'
], function (ko, html, component, game, mphl, muscleinfo, sw) {

    $.fn.maphilight.defaults = {
        fill: true,
        fillColor: 'ff0000',
        fillOpacity: 0.5,
        stroke: true,
        strokeColor: 'ff0000',
        strokeOpacity: 1,
        strokeWidth: 1,
        fade: true,
        alwaysOn: false,
        neverOn: false,
        groupBy: false,
        wrapClass: true,
        shadow: true,
        shadowX: 1,
        shadowY: 1,
        shadowRadius: 15,
        shadowColor: '000000',
        shadowOpacity: 0.8,
        shadowPosition: 'outside',
        shadowFrom: true
    };

    function showFrazzleMap(vm) {
        vm.canvas$ = $('<canvas class="frazzle" width="480px" height="550px"/>');
        vm.elem$.find('img.img-man').before(vm.canvas$);
        var context = vm.canvas$[0].getContext('2d');

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
        vm.canvas$.remove();
    }

    function ViewModel() {
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
            this.model(model);
            this.src(component.format('components/man/{0}.png', this.model().public.level()));

            this.muscles(game.getMuscles());
            var self = this;
            sw('man').show().init().progress(function (state) {
                if (state)
                    showFrazzleMap(self);
                else
                    hideFrazzleMap(self);
            });
            return this;
        };
        this.loaded = function (elem$) {
            elem$.find('.img-man').maphilight({fillColor: 'ff0000', strokeOpacity: 0, fillOpacity: 0.3, fade: true});
            this.elem$ = elem$;
        };
        this.test = function () {
            this.show().init(game.player);
        };
        this.hover = function (e, muscle) {
            var pos = this.elem$.offset();
            muscleinfo('man').show().init(muscle, {x: e.clientX - pos.left - 150, y: e.clientY - pos.top - 150});
        };
        this.out = function () {
            muscleinfo('man').hide();
        };
    }

    return component.add(ViewModel, html, 'man');
});