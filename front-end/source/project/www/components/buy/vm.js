define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'components/gold/vm'
], function (ko, html, c, gold) {

    function ViewModel(){

        this.strings = c.strings;

        this.init = function(value){
            this.model(value);
            gold('buy').show().init(value);
        };

        this.test = function(){
            this.show().init(3);
        };
    }

    return c.add(ViewModel, html, 'buy');
});