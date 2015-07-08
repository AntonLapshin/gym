define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer,
        _state = false;

    function ViewModel() {

        this.init = function(){
            return $.Deferred(function(defer){
                _defer = defer;
            });
        };

        this.test = function () {
            this.show().init().progress(function(state){
                console.log(state)
            });
        };

        this.click = function(e){
            $(e.click.arguments[1].currentTarget).prev('input').click();
            _state = !_state;
            _defer.notify(_state);
        }
    }

    return component.add(ViewModel, html, 'sw');
});