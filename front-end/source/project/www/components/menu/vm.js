define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer,
        strings = component.strings;

    var _items = [
        { name: strings.menuHome, active: ko.observable(true) },
        { name: strings.menuJob, active: ko.observable(false) },
        { name: strings.menuWorkout, active: ko.observable(false) },
        { name: strings.menuAchievements, active: ko.observable(false) },
        { name: strings.menuShop, active: ko.observable(false) }
    ];

    function ViewModel() {
        var self = this;

        this.items = ko.observableArray(_items);

        this.init = function () {
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        };

        this.selectByIndex = function(index){
            _items.forEach(function(item){
                item.active(false);
            });
            if (index >= 0) {
                _items[index].active(true);
                _defer.notify(index);
            }
        };

        this.select = function(){
            var index = self.items().indexOf(this);
            self.selectByIndex(index);
        };

        this.test = function () {
            this.show().init()
                .progress(function(index){
                    console.log('Selected item is ' + index);
                });
        };
    }

    return component.add(ViewModel, html, 'menu');
});