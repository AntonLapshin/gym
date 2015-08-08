define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){
        this.title = c.strings.bankEnergy;

        this.click = function(){
            c.fire('energy.add');
        };

        this.test = function(){
            var v = ko.observable(10);
            this.init().set(v).show();
            v(15);
        };
    }

    return c.add(ViewModel, html, 'energy');
});
