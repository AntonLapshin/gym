define([
    'ko',
    'jquery',
    'text!./view.html',
    'c',
    'cs/battery/vm'
], function(ko, $, html, c, battery) {

    function ViewModel() {
        var self = this;
        this.strings = c.strings;

        this.init = function(){
            battery('muscleinfo').init().show();
            return self;
        };

        this.set = function(muscle){
            this.model(muscle);

            if (muscle.frazzle){
                var b = battery('muscleinfo');
                var fr = Math.floor(100 - muscle.frazzle() * 100);
                fr = c.round(fr);

                if (!b.value) {
                    var max = ko.observable(100),
                        value = ko.observable(fr);
                    b.set(max, value, '%');
                }
                else {
                    b.value(fr);
                }
            }

            return self;
        };

        this.test = function () {
            var muscle = {
                _id: 3,
                frazzle: ko.observable(0.5),
                stress: ko.observable(0.2),
                x1: 50,
                y1: 50
            };
            this.init().set(muscle).show();
            $('body').css('background-color', 'black');
        };
    }

    return c.add(ViewModel, html, 'muscleinfo');
});