define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/player'
], function (ko, html, c, Player) {

    function ViewModel() {

        var self = this;

        this.init = function(id){
            var self = this;
            var player = new Player(id);
            player.load().then(function(){
                self.model(player);
            });
            return this;
        };

        this.test = function () {
            this.show().init(60981233);
        };

        this.click = function(e){
            c.fire('player.click', self.model()._id);
        }
    }

    return c.add(ViewModel, html, 'player');
});