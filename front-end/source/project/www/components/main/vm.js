define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/private/vm'
], function (ko, html, component, private) {

    function ViewModel() {

        this.player = ko.observable(null);

        this.show = function (player) {
            private.show(player);
        };

        this.test = function () {
            this.isVisible(true);
            private.test();
        };


    }

    return component.add(ViewModel, html, 'private');
});