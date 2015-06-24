define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    var _defer;

    var _viewModel = {
        title: component.strings.gymsTitle,
        btnEnterText: component.strings.gymsBtnEnter,
        gyms: ko.observableArray(),

        show: function (gyms) {
            this.gyms(gyms);
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        select: function(){
            var index = _viewModel.gyms().indexOf(this);
            _defer.resolve(index);
        },

        test: function () {
            var self = this;
            require(['model/gyms'], function(gyms){
                gyms.forEach(function(gym){
                    gym.active = false;
                    gym.disabled = true;
                });
                gyms[0].active = true;
                gyms[0].disabled = false;
                self.show(gyms)
                    .then(function(index){
                        console.log('Selected gym is ' + index);
                    });
            });
        }
    };

    return component.add(_viewModel, html, 'gyms');
});