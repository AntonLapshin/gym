define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'model/game'
], function (ko, $, html, c, game) {

    function ViewModel() {
        var self = this;

        this.strings = c.strings;

        this.init = function(){
            this.model(game.getAchievements());
            return self;
        };

        this.test = function () {
            this.show().init();
        };
    }

    return c.add(ViewModel, html, 'achievements');
});