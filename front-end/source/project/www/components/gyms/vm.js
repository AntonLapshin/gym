define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/game'
], function (ko, html, c, game) {

    var _defer;

    function ViewModel() {
        this.strings = c.strings;
        this.gyms = ko.observableArray();

        this.show = function () {
            var gyms = game.getGyms();
            gyms.forEach(function (gym) {
                gym.active = false;
                gym.disabled = true;
            });
            gyms[0].active = true;
            this.gyms(gyms);
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        };

        var self = this;

        this.select = function () {
            var index = self.gyms().indexOf(this);
            _defer.resolve(index);
        };

        this.test = function () {
            this.show()
                .then(function (index) {
                    console.log('Selected gym is ' + index);
                });
        }
    }

    return c.add(ViewModel, html, 'gyms');
});