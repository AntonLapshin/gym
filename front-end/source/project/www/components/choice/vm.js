define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/team/vm',
    'plugins/localization',
    'model/teams'
], function (ko, html, component, team, strings, teams) {

    var _defer;

    var _viewModel = {
        isVisible: ko.observable(false),
        items: ko.observableArray(teams),
        title: strings.choiceTitle,

        show: function () {
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        ok: function (index) {
            this.isVisible(false);
            _defer.resolve(index);
        },

        test: function () {
            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            this.show().then(function (index) {
                alert('Selected team is ' + index);
            })
        }
    };

    return component.add(_viewModel, html, 'choice');
});