define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/ava/vm',
    'c/battery/vm',
    'c/mass/vm',
    'c/money/vm',
    'c/friends/vm'
], function (ko, html, component, ava, battery, mass, money, friends) {

    function ViewModel() {

        this.show = function(player){
            ava('private').show(player.public);
            battery('private').show(player.private.energyMax, player.private.energy);
            mass('private').show(player.public.mass);
            money('private').show(player.private.money);
            friends('private').show(player.private.friends);
            this.isVisible(true);
        };

        this.test = function () {
            var self = this;
            require(['model/game'], function(game){
                self.show(game.player);
            });
        };

    }

    return component.add(ViewModel, html, 'private');
});