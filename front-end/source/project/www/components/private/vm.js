define([
    'ko',
    'text!./view.html',
    'c',
    'cs/member/vm',
    'cs/battery/vm',
    'cs/mass/vm',
    'cs/money/vm',
    'cs/gold/vm',
    'cs/friends/vm',
    'cs/level/vm'
], function (ko, html, c, member, battery, mass, money, gold, friends, level) {

    function ViewModel() {
        var self = this;

        this.init = function(){
            member('private').init().show();
            battery('private').init().show();
            mass('private').init().show();
            money('private').init().show();
            gold('private').init().show();
            friends('private').init().show();
            level('private').init().show();
            return self;
        };

        this.set = function(player){
            member('private').set(player);
            battery('private').set(player.private.energyMax, player.private.energy);
            mass('private').set(player.public.mass);
            money('private').set(player.private.money);
            gold('private').set(player.private.gold);
            friends('private').set(player.private.friends);
            level('private').set(player.public.level);
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