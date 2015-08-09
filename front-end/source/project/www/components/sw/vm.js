define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    function ViewModel() {
        var self = this;
        this.state = false;

        this.click = function(e){
            $(e.click.arguments[1].currentTarget).prev('input').click();
            self.state = !self.state;
            c.fire('sw.switch', { name: self.name, state: self.state });
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