define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel() {
        var self = this;

        this.red = ko.observable();
        this.yellow = ko.observable();
        this.title = c.strings.bankEnergy;
        this.value = null;

        // max and value are ko.observable
        this.set = function (max, value, type) {
            this.max = max;
            this.value = value;

            this.percent = ko.computed(function(){
                return (this.value() / this.max()) * 100 + '%';
            }, this);

            this.red = ko.computed(function () {
                return this.max() * 0.33;
            }, this);
            this.yellow = ko.computed(function () {
                return this.max() * 0.66;
            }, this);
            this.valueDesc = ko.computed(function(){
                if (type === '%')
                    return (this.value() / this.max()) * 100 + '%';
                return this.value() + '/' + this.max();
            }, this);
            return self;
        };

        this.click = function () {
            c.fire('energy.add');
        };

        this.test = function () {
            var max = ko.observable(155),
                value = ko.observable(115);
            this.init().set(max, value).show();

            var p = 0;

            function go() {
                value(p);
                if (p < max())
                    window.setTimeout(go, 20);
                p++;
            }

            window.setTimeout(go, 1000);
        };
    }

    return c.add(ViewModel, html, 'battery');
});