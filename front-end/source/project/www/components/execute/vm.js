define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer;

    function calcExecutePlan(repeatsPlan, repeatsFactMax) {
        _executePlan = [];

        var x1 = repeatsFactMax * MAX / 3,
            x2 = x1 * 2,
            executeStep,
            repeatsFact = Math.min(repeatsPlan, repeatsFactMax),
            speed;
        for (var i = 0; i < repeatsFact * MAX; i++) {
            if (i < x1) {
                speed = 3;
            }
            else if (i < x2) {
                speed = 2;
            }
            else {
                speed = 1;
            }

            if (i % MAX === 0) {
                executeStep = [];
                _executePlan.push(executeStep);
            }

            executeStep.push(speed);
        }
    }

    var _executePlan,
        _repeat = 0,
        _index = 0,
        MAX = 50;

    var _viewModel = {

        repeats: ko.observable(0),
        percent: ko.observable(30),
        isSuccess: ko.observable(false),
        isWarning: ko.observable(false),
        isDanger: ko.observable(false),

        show: function (repeatsPlan, repeatsFactMax) {
            calcExecutePlan(repeatsPlan, repeatsFactMax);
            this.start();
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        start: function () {
            this.repeats(0);
            this.percent(0);
            this.isSuccess(false);
            this.isWarning(false);
            this.isDanger(false);

            _repeat = 0;
            _index = 0;

            this.execute();
        },

        getDelay: function (speed) {
            if (speed === 3) {
                this.isSuccess(true);
                this.isWarning(false);
                this.isDanger(false);
                return 10;
            }

            if (speed === 2) {
                this.isSuccess(false);
                this.isWarning(true);
                this.isDanger(false);
                return 20;
            }

            this.isSuccess(false);
            this.isWarning(false);
            this.isDanger(true);
            return 30;
        },

        execute: function () {
            var repeat = _executePlan[_repeat];
            if (!repeat) {
                _defer.resolve();
                return;
            }
            var speed = repeat[_index];
            if (!speed) {
                _defer.resolve();
                return;
            }

            _viewModel.percent((_index + 1) * 2);

            var delay = _viewModel.getDelay(speed);

            _index++;
            if (_index === MAX){
                _index = 0;
                _repeat++;
                _viewModel.repeats(_repeat);
            }

            setTimeout(_viewModel.execute, delay);
        },

        test: function () {
            this.show(1, 1)
                .then(function(){
                    console.log('finished');
                });
        }
    };

    return component.add(_viewModel, html, 'execute');
});