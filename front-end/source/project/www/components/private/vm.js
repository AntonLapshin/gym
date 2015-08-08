define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/ava/vm',
    'c/battery/vm',
    'c/mass/vm',
    'c/money/vm',
    'c/gold/vm',
    'c/friends/vm'
], function (ko, html, c, ava, battery, mass, money, gold, friends) {

    function ViewModel() {
        var self = this;

        this.init = function(){
            ava('private').init().show();
            battery('private').init().show();
            mass('private').init().show();
            money('private').init().show();
            gold('private').init().show();
            friends('private').init().show();
            friends('private').init().show();
            return self;
        };

        this.set = function(player){
            ava('private').set(player);
            battery('private').set(player.private.energyMax, player.private.energy);
            mass('private').set(player.public.mass);
            money('private').set(player.private.money);
            gold('private').set(player.private.gold);
            friends('private').set(player.private.friends);
            return self;
        };

        this.test = function () {
            require(['model/game'], function(game){
                self.init().set(game.player).show();
            });
        };

    }

    return c.add(ViewModel, html, 'private');
});