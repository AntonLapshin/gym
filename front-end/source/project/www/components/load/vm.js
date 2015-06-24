define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'jquery',
    'plugins/localization'
], function (ko, html, component, $, strings) {

    var _defer;

    var _viewModel = {
        isLoaded: ko.observable(false),
        percent: ko.observable(0),
        buttonName: strings.btnStart,

        show: function () {
            this.percent(0);
            this.isVisible(true);
            this.isLoaded(false);
            var self = this;
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        onPercentChanged: function (percent) {
            this.percent(percent);
            if (percent === 100)
                this.isLoaded(true);
        },

        start: function () {
            this.isVisible(false);
            _defer.resolve();
        },

        test: function () {
            this.show().then(function () {
                console.log('Finish');
            });

            var p = 0;
            var self = this;

            function go() {
                self.onPercentChanged(p);
                if (p < 100)
                    window.setTimeout(go, 10);
                p++;
            }

            go();
        }
    };

    return component.add(_viewModel, html, 'load');
});