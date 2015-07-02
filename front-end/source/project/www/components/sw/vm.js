define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer,
        _state = false;

    function ViewModel(name) {

        this.id = ko.observable(name);

        this.show = function(){
            this.isVisible(true);
            return $.Deferred(function(defer){
                _defer = defer;
            });
        };

        this.test = function () {
            this.show().progress(function(state){
                console.log(state)
            });
        };

        this.click = function(){
            _state = !_state;
            _defer.notify(_state);
        }
    }

    return component.add(ViewModel, html, 'sw');
});