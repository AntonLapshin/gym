define(['model/player', 'server/server'], function (Player, server) {

    return {
        player: null,
        refs: null,
        init: function(){
            this.player = new Player();
            var deferPlayer = this.player.load();
            var self = this;
            var deferRefs = server.loadRefs().then(function(data){
                self.refs = data;
            });
            return $.when.apply(this, [deferPlayer, deferRefs]);
        }
    }
});