define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer,
        strings = component.strings;

    var _items = [
        { name: strings.menuHome, active: ko.observable(true) },
        { name: strings.menuTraining, active: ko.observable(false) },
        { name: strings.menuRest, active: ko.observable(false) },
        { name: strings.menuAwards, active: ko.observable(false) },
        { name: strings.menuShop, active: ko.observable(false) }
    ];

    var _viewModel = {
        items: ko.observableArray(_items),

        show: function () {
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        select: function(){
            _items.forEach(function(item){
                item.active(false);
            });
            this.active(true);
            var index = _viewModel.items().indexOf(this);
            _defer.notify(index);
        },

        test: function () {
            this.show()
                .progress(function(index){
                    console.log('Selected item is ' + index);
                });
        }
    };

    return component.add(_viewModel, html, 'menu');
});