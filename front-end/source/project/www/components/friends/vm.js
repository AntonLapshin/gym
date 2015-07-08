define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){

        this.title = c.strings.socialFriends;

        this.test = function(){
            var v = ko.observable(10);
            this.show().init(v);
            v(5);
        };

        this.click = function(){
            c.fire('friends.add');
        };
    }

    return c.add(ViewModel, html, 'friends');
});
