define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/game',
    'c/private/vm',
    'c/menu/vm',
    'c/man/vm'
], function (ko, html, component, game, private, menu, man) {

    function ViewModel() {

        this.show = function (player) {
            private('main').show(player);
            menu('main').show();
            man('main').show(player);
            this.isVisible(true);
        };

        this.test = function () {
            this.show(game.player);
        };
    }

    return component.add(ViewModel, html, 'main');
});