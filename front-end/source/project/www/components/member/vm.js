define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'social/social'
], function (ko, html, c, social) {

    function ViewModel() {
        var self = this;

        this.autoShow = function(model){
            self.show().init(model);
        };

        this.set = function(model){
            if (model._id === -1){
                model.public.img = social.getUnknowImg();
            }
            this.model(model);
            return self;
        };

        this.init = function(model){
            this.set(model);
        };

        this.click = function () {
            if (self.model()._id == -1) // may be "0"
            {
                social.invite();
                return;
            }
            c.fire('player.click', self.model()._id);
        };
        this.test = function () {
            require(['model/game'], function(game){
                self.show().init(game.player);
            });

            //require(['model/player'], function(Player){
            //    self.show().init(Player(-1));
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