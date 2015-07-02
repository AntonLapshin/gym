define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer,
        _state = false;

    function ViewModel() {

        this.id = ko.observable(null);

        this.show = function(id){
            this.id(id);
            this.isVisible(true);
            return $.Deferred(function(defer){
                _defer = defer;
            });
        };

        this.test = function () {
            this.show('test').progress(function(state){
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