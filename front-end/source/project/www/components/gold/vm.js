define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel(){

        this.title = component.strings.bankGold;

        this.test = function(){
            var v = ko.observable(10);
            this.show().init(v);
            v(15);
        };

        this.click = function(){
            c.fire('gold.add');
        };
    }

    return component.add(ViewModel, html, 'gold');
});
