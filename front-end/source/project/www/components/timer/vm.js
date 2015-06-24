define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer,
        _interval,
        _seconds;

    function ViewModel() {
        this.value = ko.observable('');

        this.setValue = function () {
            var min = Math.floor(_seconds / 60);
            var sec = Math.floor(_seconds % 60);
            if (sec < 10)
                sec = '0' + sec;
            this.value(min + ':' + sec);
        };

        this.show = function (seconds) {
            if (_interval)
                return;

            _seconds = seconds;

            this.setValue();
            var self = this;
            _interval = setInterval(function () {
                _seconds--;
                self.setValue();
                if (_seconds === 0) {
                    _defer.resolve();
                    clearInterval(_interval);
                }
            }, 1000);

            this.isVisible(true);

            return $.Deferred(function(defer){
                _defer = defer;
            });
        };

        this.test = function () {
            this.show(2)
                .then(function(){
                    console.log('finished');
                });
        }
    }

    return component.add(ViewModel, html, 'timer');
});