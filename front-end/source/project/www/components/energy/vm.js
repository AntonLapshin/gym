define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel(){

        this.title = component.strings.bankEnergy;

        this.test = function(){
            var v = ko.observable(10);
            this.show().init(v);
            v(15);
        };

        this.click = function(){
            c.fire('energy.add');
        };
    }

    return component.add(ViewModel, html, 'energy');
});
