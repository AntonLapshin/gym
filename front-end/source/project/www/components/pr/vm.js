define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    function ViewModel(){
        this.strings = c.strings;

        this.test = function(){
            this.set(212).show();
        };
    }

    return c.add(ViewModel, html, 'pr');
});