define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    var _strings = c.strings;
    var _items = [
        { name: _strings.menuHome, active: ko.observable(true) },
        { name: _strings.menuJob, active: ko.observable(false) },
        { name: _strings.menuWorkout, active: ko.observable(false) },
        { name: _strings.menuAchievements, active: ko.observable(false) },
        { name: _strings.menuShop, active: ko.observable(false) }
    ];

    function ViewModel() {
        var self = this;

        this.items = ko.observableArray(_items);

        this.selectByIndex = function(index){
            _items.forEach(function(item){
                item.active(false);
            });
            if (index >= 0) {
                _items[index].active(true);
                c.fire('menu.select', index);
            }
        };

        this.select = function(){
            var index = self.items().indexOf(this);
            self.selectByIndex(index);
        };

        this.test = function () {
            c.on('menu.select', function(index){
                console.log('Selected item is ' + index);
            });
            this.init().show();
        };
    }

    return c.add(ViewModel, html, 'menu');
});