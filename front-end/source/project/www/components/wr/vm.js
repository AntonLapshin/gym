define([
    'ko',
    'text!./view.html',
    'c',
    'model/player'
], function (ko, html, c, Player) {

    function ViewModel(){
        var self = this;
        this.strings = c.strings;

        this.set = function(model){
            if (!model) {
                this.model(model);
                return self;
            }

            var player = new Player(model._id);
            player.load().then(function(){
                model.player = player;
                self.model(model);
            });
            return self;
        };

        this.click = function(){
            c.fire('player.click', self.model()._id);
        };

        this.test = function(){
            this.init().set({
                value: 215,
                _id: 5653333
            }).show();
        };
    }

    return c.add(ViewModel, html, 'wr');
});