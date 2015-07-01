define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'plugins/localization',
    'c/battery/vm'
], function(ko, $, html, component, strings, battery) {

    function draw(ctx, start){
        var end = ctx.elem$.position();

        if (ctx.svg$)
            ctx.svg$.remove();
        var svgHtml =
            '<svg>' +
                '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke-width="{4}" stroke="{5}"/>' +
                '<circle cx="{0}" cy="{1}" r="2" fill="{5}"/>' +
                '<circle cx="{2}" cy="{3}" r="2" fill="{5}"/>' +
            '</svg>';
        svgHtml = component.format(svgHtml, start.x, start.y - 20, end.left, end.top + 20, 1, 'rgba(220, 184, 148, 0.37)');
        ctx.svg$ = $(svgHtml);
        if ($('img.img-man').length > 0)
            $('img.img-man').before(ctx.svg$);
        else
            ctx.elem$.after(ctx.svg$);
    }

    function ViewModel() {

        this.show = function(muscle, position){
            this.model(muscle);
            this.isVisible(true);
            muscle.frazzle = muscle.frazzle || 0.2;
            var max = ko.observable(100),
                value = ko.observable(muscle.frazzle*100);
            battery('muscleinfo').show(max, value, '%');

            this.position = position;
            if (!this.elem$){
                var self = this;
                this.delayed = function(){
                    draw(self, position);
                }
            }else {
                draw(this, position);
            }
        };

        this.hide = function(){
            this.isVisible(false);
            this.svg$.hide();
        };

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
            if (this.delayed){
                this.delayed();
                this.delayed = null;
            }
        };
    }

    return component.add(ViewModel, html, 'muscleinfo');
});