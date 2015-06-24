define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel() {

        this.red = ko.observable();
        this.yellow = ko.observable();
        this.title = component.strings.bankEnergy;
        this.value = null;

        // max and value are ko.observable
        this.show = function (max, value) {
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
                return this.value() + '/' + this.max();
            }, this);
            this.isVisible(true);
        };

        this.click = function () {
            alert('global event: buy battery');
        };

        this.test = function () {
            var max = ko.observable(155),
                value = ko.observable(115);
            this.show(max, value);

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

    return component.add(ViewModel, html, 'battery');
});