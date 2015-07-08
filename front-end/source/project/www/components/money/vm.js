define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){

        this.title = c.strings.bankMoney;

        this.test = function(){
            var v = ko.observable(10);
            this.show().init(v);
            v(200);
        };

        this.click = function(){
            c.fire('money.add');
        };
    }

    return c.add(ViewModel, html, 'money');
});