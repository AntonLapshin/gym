define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'social/social'
], function (ko, html, component, social) {

    function ViewModel() {
        this.user = ko.observable();
        this.show = function(user){
            this.user(user);
            this.isVisible(true);
        };
        this.click = function () {
            if (this.user().id == 0) // may be "0"
            {
                social.invite();
                return;
            }
            var url = social.getUserUrl(this.user().id);
            var win = window.open(url, '_blank');
            win.focus();
        };
        this.test = function(){
            var self = this;
            social.getMe()
                .then(function(user){
                    self.show(user);
                });
        };
    }

    return component.add(ViewModel, html, 'ava');
});