define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'plugins/localization'
], function (ko, html, component, strings) {

    var _viewModel = {
        twistvalue: ko.observable(0),
        txtTwistBall: strings.txtTwistBall,

        show: function () {
            this.isVisible(true);
        },

        hide: function () {
            this.isVisible(false);
        },

        test: function () {
            this.show();
        }
    };

    return component.add(_viewModel, html, 'twist');
});