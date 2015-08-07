define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){

        this.title = c.strings.bankEnergy;

        this.test = function(){
            var v = ko.observable(10);
            this.show().init(v);
            v(15);
        };

        this.click = function(){
            c.fire('energy.add');
        };
    }

    return c.add(ViewModel, html, 'energy');
});
