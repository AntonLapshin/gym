define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'social/social'
], function (ko, html, component, social) {

    function ViewModel() {
        this.click = function () {
            if (this.model().id == 0) // may be "0"
            {
                social.invite();
                return;
            }
            var url = social.getUserUrl(this.model().id);
            var win = window.open(url, '_blank');
            win.focus();
        };
        this.test = function(){
            var self = this;
            require(['model/game'], function(game){
                self.show(game.player.public);
            });
        };
    }

    return component.add(ViewModel, html, 'ava');
});