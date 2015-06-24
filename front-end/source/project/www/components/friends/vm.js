define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel(){

        this.title = component.strings.socialFriends;

        this.test = function(){
            var v = ko.observable(10);
            this.show(v);
            v(5);
        };

        this.click = function(){
            alert('add friends');
        };
    }

    return component.add(ViewModel, html, 'friends');
});
