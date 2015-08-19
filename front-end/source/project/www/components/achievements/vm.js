define([
    'ko',
    'jquery',
    'text!./view.html',
    'c',
    'model/refs'
], function (ko, $, html, c, Refs) {

    function ViewModel() {
        var self = this;

        this.strings = c.strings;

        this.init = function(){
            c.on('achievements.update', function(){
                self.update();
            });

            c.on('player.updated', function(){
                self.update();
            });

            return self;
        };

        this.update = function(){
            this.model(Refs.getAchievements());
            return self;
        };

        this.test = function () {
            this.init().update().show();
        };
    }

    return c.add(ViewModel, html, 'achievements');
});