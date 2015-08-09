define([
    'ko',
    'text!./view.html',
    'c',
    'social/social'
], function (ko, html, c, social) {

    function ViewModel() {
        var self = this;

        this.autoShow = function(model){
            self.init().set(model).show();
            return self;
        };

        this.set = function(model){
            if (model._id === -1){
                model.public.img = social.getUnknowImg();
            }
            this.model(model);
            return self;
        };

        this.click = function () {
            if (self.model()._id == -1) // may be "0"
            {
                social.invite();
                return;
            }
            c.fire('player.click', self.model()._id);
        };

        // hack
        this.onLoad = function(elem$){
            //setTimeout(function() {
            //    elem$.find('img.ava').tooltip();
            //}, 1000);
        };

        this.test = function () {
            require(['model/game'], function(game){
                self.init().set(game.player).show();
            });

            //require(['model/player'], function(Player){
            //    self.init().set(Player(-1)).show();
            //});
        };

        this.hover = function (item) {
            //info.show(item.user());
        };

        this.out = function () {
            //info.hide();
        };
    }

    return c.add(ViewModel, html, 'member');
});