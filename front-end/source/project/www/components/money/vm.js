define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel(){

        this.title = component.strings.bankMoney;

        this.test = function(){
            var v = ko.observable(10);
            this.show(v);
            v(200);
        };

        this.click = function(){
            alert('buy money');
        };
    }

    return component.add(ViewModel, html, 'money');
});