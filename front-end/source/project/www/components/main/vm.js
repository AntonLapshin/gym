define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/player',
    'c/private/vm',
    'c/menu/vm'
], function (ko, html, component, Player, private, menu) {

    function ViewModel() {

        this.show = function (player) {
            private('main').show(player);
            menu('main').show();
            this.isVisible(true);
        };

        this.test = function () {
            var self = this;
            var player = new Player();
            player.load().then(function(){
                self.show(player);
            });
        };


    }

    return component.add(ViewModel, html, 'main');
});