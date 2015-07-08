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

    function ViewModel() {

        this.repeats = ko.observable(0);
        this.percent = ko.observable(30);
        this.isSuccess = ko.observable(false);
        this.isWarning = ko.observable(false);
        this.isDanger = ko.observable(false);

        var self = this;

        this.init = function (repeatsPlan, repeatsFactMax) {
            calcExecutePlan(repeatsPlan, repeatsFactMax);
            this.start();
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        };

        this.start = function () {
            this.repeats(0);
            this.percent(0);
            this.isSuccess(false);
            this.isWarning(false);
            this.isDanger(false);

            _repeat = 0;
            _index = 0;

            this.execute();
        };

        this.getDelay = function (speed) {
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
        };

        this.execute = function () {
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

            self.percent((_index + 1) * 2);

            var delay = self.getDelay(speed);

            _index++;
            if (_index === MAX){
                _index = 0;
                _repeat++;
                self.repeats(_repeat);
            }

            setTimeout(self.execute, delay);
        };

        this.test = function () {
            this.show().init(1, 1)
                .then(function(){
                    console.log('finished');
                });
        }
    };

    return component.add(ViewModel, html, 'execute');
});