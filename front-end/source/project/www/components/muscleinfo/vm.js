define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'c/battery/vm'
], function(ko, $, html, c, battery) {

    function ViewModel() {

        this.init = function(muscle){
            this.model(muscle);

            if (muscle.frazzle){
                var b = battery('muscleinfo');
                var fr = Math.floor(100 - muscle.frazzle() * 100);

                if (!b.value) {
                    var max = ko.observable(100),
                        value = ko.observable(fr);
                    b.show().init(max, value, '%');
                }
                else {
                    b.value(fr);
                }
            }
        };

        this.hide = function(){
            this.isVisible(false);
            return this;
        };

        this.strings = c.strings;

        this.test = function () {
            var muscle = {
                _id: 3,
                frazzle: ko.observable(0.5),
                stress: ko.observable(0.2),
                x1: 50,
                y1: 50
            };
            this.show().init(muscle);
            $('body').css('background-color', 'black');
        };
    }

    return c.add(ViewModel, html, 'muscleinfo');
});