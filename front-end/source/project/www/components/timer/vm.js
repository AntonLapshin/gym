define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel() {
        var self = this;
        this.value = ko.observable('');
        this.interval = null;
        this.seconds = null;

        this.setValue = function () {
            var min = Math.floor(self.seconds / 60);
            var sec = Math.floor(self.seconds % 60);
            if (sec < 10)
                sec = '0' + sec;
            this.value(min + ':' + sec);
        };

        this.start = function (seconds) {
            this.stop();
            this.seconds = seconds;

            this.setValue();
            this.interval = setInterval(function () {
                self.seconds--;
                self.setValue();
                if (self.seconds === 0) {
                    c.fire('timer.stop', self.name);
                    self.stop();
                }
            }, 1000);
            return self;
        };

        this.stop = function(){
            self.hide();
            clearInterval(self.interval);
        };

        this.test = function () {
            c.on('timer.stop', function(){
                console.log('finished');
            });
            this.init().start(2).show();
        }
    }

    return c.add(ViewModel, html, 'timer');
});