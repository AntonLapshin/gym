define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'plugins/localization',
    'c/battery/vm'
], function(ko, $, html, component, strings, battery) {

    function draw(elem$, context, position){
        var posEnd = elem$.position();
        context.beginPath();
        context.moveTo(position.x, position.y);
        context.lineTo(posEnd.left, posEnd.top + 20);
        context.closePath();
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(220, 184, 148, 0.37)';
        context.stroke();
        context.beginPath();
        context.arc(position.x, position.y, 2, 0, 2 * Math.PI, false);
        context.arc(posEnd.left, posEnd.top + 20, 2, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(220, 184, 148, 0.57)';
        context.fill();
    }

    function ViewModel() {


        this.show = function(muscle, position){
            this.model(muscle);
            this.isVisible(true);
            var max = ko.observable(100),
                value = ko.observable(muscle.frazzle*100);
            battery('muscleinfo').show(max, value);

            this.position = position;
            if (!this.context){
                var self = this;
                this.delayed = function(){
                    draw(self.elem$, self.context, position);
                }
            }else {
                draw(this.elem$, this.context, position);
            }
        };

        this.frazzle = ko.computed(function(){
            var value = this.model && this.model() ? this.model().frazzle : 0;
            if (value == 0) return 0;
            if (0 < value && value <= 0.2) return 1;
            if (0.2 < value && value <= 0.5) return 2;
            if (0.5 < value && value <= 0.8) return 3;
            if (0.8 < value && value <= 1) return 4;
        }, this);

        this.strings = strings;

        this.test = function () {
            var muscle = {
                _id: 3,
                frazzle: 0.5,
                stress: 0.2
            };
            this.show(muscle, { x: 100, y: 400 });
        };

        this.loaded = function(elem$){
            this.elem$ = elem$;
            var canvas$ = $('<canvas width="550px" height="550px"/>');
            elem$.after(canvas$);
            this.context = canvas$[0].getContext('2d');
            if (this.delayed){
                this.delayed();
                this.delayed = null;
            }

        };
    }

    return component.add(ViewModel, html, 'muscleinfo');
});