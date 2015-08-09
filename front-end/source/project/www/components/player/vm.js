define([
    'ko',
    'text!./view.html',
    'c',
    'model/player'
], function (ko, html, c, Player) {

    function ViewModel() {
        var self = this;

        this.set = function(id){
            var self = this;
            var player = new Player(id);
            player.load().then(function(){
                self.model(player);
            });
            return self;
        };

        this.click = function(e){
            c.fire('player.click', self.model()._id);
        };

        this.test = function () {
            this.init().set(60981233).show();
        };
    }

    return c.add(ViewModel, html, 'player');
});