define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    function ViewModel() {
        var self = this;
        this.state = false;

        this.init = function(initValue){
            self.initValue = !!initValue;
            return self;
        };

        this.click = function(e){
            $(e.click.arguments[1].currentTarget).prev('input').click();
            self.state = !self.state;
            c.fire('sw.switch', { name: self.name, state: self.state });
        };

        this.set = function(state){
            if (self.state != state) {
                self.elem$.find('input').click();
                self.state = !self.state;
            }
            return self;
        };

        this.get = function(){
            return self.state;
        };

        this.onLoad = function(){
            self.set(self.initValue);
        };

        this.test = function () {
            c.on('sw.switch', function(data){
                console.log(data);
            });
            this.init().show();
        };
    }

    return c.add(ViewModel, html, 'sw');
});