define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, c) {

    function ViewModel(){
        this.title = c.strings.socialFriends;

        this.click = function(){
            c.fire('friends.add');
        };

        this.test = function(){
            var v = ko.observable(10);
            this.init().set(v).show();
            v(5);
        };
    }

    return c.add(ViewModel, html, 'friends');
});
