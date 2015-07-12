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

        this.init = function(player){
            ava('private').show().init(player.public);
            battery('private').show().init(player.private.energyMax, player.private.energy);
            mass('private').show().init(player.public.mass);
            money('private').show().init(player.private.money);
            gold('private').show().init(player.private.gold);
            friends('private').show().init(player.private.friends);
        };

        this.test = function () {
            var self = this;
            require(['model/game'], function(game){
                self.show().init(game.player);
            });
        };

    }

    return c.add(ViewModel, html, 'private');
});