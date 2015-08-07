define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'model/refs'
], function (ko, $, html, c, Refs) {

    function ViewModel() {
        var self = this;

        this.strings = c.strings;

        this.init = function(){
            this.model(Refs.getAchievements());
            return self;
        };

        this.test = function () {
            this.show().init();
        };
    }

    return c.add(ViewModel, html, 'achievements');
});