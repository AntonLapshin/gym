define([
    'ko',
    'text!./view.html',
    'c',
    'model/refs'
], function (ko, html, c, Refs) {

    function ViewModel() {
        var self = this;

        this.strings = c.strings;
        this.selectedGym = ko.observable(null);
        this.gyms = ko.observableArray();

        this.update = function () {
            var gyms = Refs.getGyms();
            this.gyms(gyms);
            this.selectedGym(gyms[0]);
            return self;
        };

        this.select = function () {
            var index = self.gyms().indexOf(this);
            c.fire('gyms.select', index);
        };

        this.getIndex = function(){
            return self.gyms().indexOf(self.selectedGym());
        };

        this.nextEnabled = ko.computed(function(){
            return self.gyms().indexOf(self.selectedGym()) < self.gyms().length - 1;
        }, this);

        this.prevEnabled = ko.computed(function(){
            return self.gyms().indexOf(self.selectedGym()) > 0;
        }, this);

        this.next = function(){
            var nextGym = self.gyms()[self.getIndex() + 1];
            self.selectedGym(nextGym);
        };

        this.prev = function(){
            var prevGym = self.gyms()[self.getIndex() - 1];
            self.selectedGym(prevGym);
        };

        this.test = function () {
            this.init().update().show();
        };
    }

    return c.add(ViewModel, html, 'gyms');
});