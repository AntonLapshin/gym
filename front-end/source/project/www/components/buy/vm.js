define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'components/gold/vm'
], function (ko, html, c, gold) {

    function ViewModel(){
        var self = this;

        this.strings = c.strings;

        this.set = function(value){
            this.model(value);
            gold('buy').set(value).show();
            return self;
        };

        this.test = function(){
            this.init().set(3).show();
        };
    }

    return c.add(ViewModel, html, 'buy');
});