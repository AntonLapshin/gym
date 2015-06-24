define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'plugins/localization'
], function (ko, html, component, strings) {

    var _defer;

    var _viewModel = {
        header1: strings.header1,
        header2: strings.header2,
        desc: strings.introDesc,
        btnStart: strings.btnStart,
        btnInstruction: strings.btnInstruction,

        show: function () {
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            })
        },

        start: function () {
            var self = this;
            setTimeout(function () {
                _defer.notify('start');
            }, 300);
        },
        rules: function () {
            var self = this;
            setTimeout(function () {
                _defer.notify('rules');
            }, 300);
        },

        test: function () {
            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            this.show().progress(function (result) {
                alert(result);
            });
        }
    };

    return component.add(_viewModel, html, 'intro');
});