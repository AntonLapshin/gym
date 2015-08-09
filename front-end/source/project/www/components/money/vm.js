define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    function ViewModel(){
        this.title = c.strings.bankMoney;

        this.click = function(){
            c.fire('money.add');
        };

        this.test = function(){
            var v = ko.observable(10);
            this.init().set(v).show();
            v(200);
        };
    }

    return c.add(ViewModel, html, 'money');
});