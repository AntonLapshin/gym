define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/player'
], function (ko, html, c, Player) {

    function ViewModel(){

        var self = this;
        this.strings = c.strings;

        this.init = function(model){
            if (!model) {
                this.model(model);
                return;
            }

            var player = new Player(model._id);
            player.load().then(function(){
                model.player = player;
                self.model(model);
            });
        };

        this.test = function(){
            this.show().init({
                value: 215,
                _id: 5653333
            });
            //this.show().init();
        };

        this.click = function(){
            c.fire('player.click', self.model()._id);
        }
    }

    return c.add(ViewModel, html, 'wr');
});