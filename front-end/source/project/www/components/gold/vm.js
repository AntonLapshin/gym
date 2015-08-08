define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){
        this.title = c.strings.bankGold;

        this.click = function(){
            c.fire('gold.add');
        };

        this.test = function(){
            var v = ko.observable(10);
            this.init().set(v).show();
            v(15);
        };
    }

    return c.add(ViewModel, html, 'gold');
});
