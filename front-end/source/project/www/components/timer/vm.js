define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel() {
        var self = this;
        this.value = ko.observable('');
        this.defer = null;
        this.interval = null;
        this.seconds = null;

        this.setValue = function () {
            var min = Math.floor(self.seconds / 60);
            var sec = Math.floor(self.seconds % 60);
            if (sec < 10)
                sec = '0' + sec;
            this.value(min + ':' + sec);
        };

        this.init = function (seconds) {
            this.stop();
            this.seconds = seconds;

            this.setValue();
            this.interval = setInterval(function () {
                self.seconds--;
                self.setValue();
                if (self.seconds === 0) {
                    self.defer.resolve();
                    self.stop();
                }
            }, 1000);

            return $.Deferred(function(defer){
                self.defer = defer;
            });
        };

        this.stop = function(){
            clearInterval(self.interval);
        };

        this.test = function () {
            this.show().init(2)
                .then(function(){
                    console.log('finished');
                });
        }
    }

    return c.add(ViewModel, html, 'timer');
});