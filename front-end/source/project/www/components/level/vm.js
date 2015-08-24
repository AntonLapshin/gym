define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    function ViewModel(){
        this.title = c.strings.level;

        this.click = function(){
            c.fire('level.add');
        };

        this.test = function(){
            var v = ko.observable(10);
            this.init().set(v).show();
            v(15);
        };
    }

    return c.add(ViewModel, html, 'level');
});
