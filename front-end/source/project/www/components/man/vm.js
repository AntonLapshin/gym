define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/game',
    'maphilight',
    'c/muscleinfo/vm'
], function (ko, html, component, game, mphl, muscleinfo) {

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

    function showFrazzleMap(elem$, muscles){
        var canvas$ = $('<canvas class="frazzle" width="480px" height="550px"/>');
        elem$.find('img.img-man').before(canvas$);
        var context = canvas$[0].getContext('2d');

        $.each(muscles(), function(j, m){

            var map = m.map.split(',');
            context.beginPath();
            context.moveTo(map[0], map[1]);
            for(var i = 2; i < map.length - 1; i = i + 2){
                context.lineTo(map[i], map[i + 1]);
            }

            context.closePath();
            //context.lineWidth = 5;
            //context.strokeStyle = 'blue';
            context.fillStyle = component.format('rgba(255,0,0,{0})', component.random(0,40) / 100);
            context.fill();
            //context.stroke();
        });
    }

    function ViewModel() {
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
        this.show = function(model){
            this.model(model);
            this.src(component.format('components/man/{0}.png', model.public.level()));

            var view = $.grep(game.refs.muscles_view, function(m){
                return m._id == model.public.level();
            })[0];
            var muscles = $.map(view.front, function(m){
                var newMap = $.map(m.map.split(','), function(c, i) { return i % 2 == 0 ? c - 50 : c; }).join(',');
                return { _id: m._id, map: newMap };
            });
            this.muscles(muscles);
            this.isVisible(true);
        };
        this.loaded = function(elem$){
            elem$.find('.img-man').maphilight({fillColor: 'ff0000', strokeOpacity: 0, fillOpacity: 0.3, fade: true});
        };
        this.test = function(){
            this.show(game.player);
        };
        this.hover = function(e, muscle){
            muscleinfo('man').show(muscle, { x: e.clientX, y: e.clientY });
        }
    }

    return component.add(ViewModel, html, 'man');
});