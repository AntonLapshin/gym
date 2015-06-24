define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'plugins/localization'
], function (ko, html, component, strings) {

    var _viewModel = {
        lang: ko.observable(window.cfg.language),

        show: function () {
            this.isVisible(true);
        },

        en: function () {
            this.lang('en');
            strings.setLanguage('en');
        },

        ru: function () {
            this.lang('ru');
            strings.setLanguage('ru');
        },

        test: function () {
            this.show();
        }
    };

    return component.add(_viewModel, html, 'lang');
});