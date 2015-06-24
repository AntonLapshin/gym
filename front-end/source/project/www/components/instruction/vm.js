define([
    'ko',
    'bootstrap',
    'text!./view.html',
    'plugins/component',
    'plugins/localization'
], function (ko, bootstrap, html, component, strings) {

    var _defer;

    var _viewModel = {
        title: strings.instructionTitle,
        rules1: strings.rules1,
        rules2: strings.rules2,
        rulePenalty: strings.rulePenalty,
        prev: strings.prev,

        show: function () {
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        loaded: function(elem$){
            elem$.find('#b1').tooltip();
        },

        back: function () {
            var self = this;
            setTimeout(function () {
                self.isVisible(false);
                _defer.resolve();
            }, 300);
        },

        test: function () {

            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            this.show().then(function () {
                console.log('back');
            });
        }
    };

    return component.add(_viewModel, html, 'instruction');
});