define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel() {
        var self = this;
        this.defer = null;
        this.state = false;

        this.init = function(){
            return $.Deferred(function(defer){
                self.defer = defer;
            });
        };

        this.test = function () {
            this.show().init().progress(function(state){
                console.log(state)
            });
        };

        this.click = function(e){
            $(e.click.arguments[1].currentTarget).prev('input').click();
            self.state = !self.state;
            self.defer.notify(self.state);
        }
    }

    return component.add(ViewModel, html, 'sw');
});