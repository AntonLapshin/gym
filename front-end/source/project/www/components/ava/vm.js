define([
    'ko',
    'text!./view.html',
    'c',
    'social/social'
], function (ko, html, c, social) {

    function ViewModel() {
        this.click = function () {
            if (this.model().private) {
                c.fire('player.click', this.model()._id);
                return;
            }
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
        this.onLoaded = function(elem$){
            setTimeout(function() {
                elem$.find('img.frame').tooltip();
            }, 1000);
        };
        this.test = function(){
            var self = this;
            require(['model/game'], function(game){
                self.init().set(game.player).show();
            });
        };
    }

    return c.add(ViewModel, html, 'ava');
});