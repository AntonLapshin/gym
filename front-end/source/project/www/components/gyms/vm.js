define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'model/game'
], function (ko, html, c, game) {

    function ViewModel() {
        this.strings = c.strings;
        this.gyms = ko.observableArray();

        this.init = function () {
            var gyms = game.getGyms();
            gyms.forEach(function (gym) {
                gym.active = false;
                gym.disabled = true;
            });
            gyms[0].active = true;
            this.gyms(gyms);
        };

        var self = this;

        this.select = function () {
            var index = self.gyms().indexOf(this);
            c.fire('gyms.select', index);
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