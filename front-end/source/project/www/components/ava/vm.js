define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'social/social'
], function (ko, html, c, social) {

    function ViewModel() {
        this.click = function () {
            if (this.model()._id == 0) // may be "0"
            {
                social.invite();
                return;
            }
            var url = social.getUserUrl(this.model()._id);
            var win = window.open(url, '_blank');
            win.focus();
        };
        // hack
        this.loaded = function(elem$){
            setTimeout(function() {
                elem$.find('img.frame').tooltip();
            }, 1000);
        };
        this.test = function(){
            var self = this;
            require(['model/game'], function(game){
                self.show().init(game.player);
            });
        };
    }

    return c.add(ViewModel, html, 'ava');
});