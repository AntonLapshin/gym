define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'social/social',
    'server/server',
    'c/ava/vm',
    'c/battery/vm',
    'c/mass/vm',
    'c/money/vm',
    'c/friends/vm'
], function (ko, html, component, social, server, ava, battery, mass, money, friends) {

    function ViewModel() {

        this.player = ko.observable(null);

        this.show = function (player) {
            this.player(player);
            this.isVisible(true);
        };

        this.test = function () {
            this.isVisible(true);
            ava('private').test();
            battery('private').test();
            mass('private').test();
            money('private').test();
            friends('private').test();
        };


    }

    return component.add(ViewModel, html, 'private');
});