define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){

        var self = this;
        this.strings = c.strings;

        this.test = function(){
            this.show().init(212);
            //this.show().init();
        };
    }

    return c.add(ViewModel, html, 'pr');
});