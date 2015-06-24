define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/info/vm',
    'social/social'
], function (ko, html, component, info, social) {

    function ViewModel() {
        this.user = ko.observable();
        this.show = function (params) {
            this.set(params);
            this.isVisible(true);
        };
        this.set = function(params){
            if (params && params.user)
                this.user(params.user);
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
        this.test = function () {
            var self = this;
            require(['controllers/users'], function (UsersController) {
                UsersController.getMe()
                    .then(function (user) {
                        self.show({ user: user });
                    });
            });
        };

        this.hover = function (item) {
            info.show(item.user());
        };

        this.out = function () {
            info.hide();
        };
    }

    return component.add(ViewModel, html, 'member');
});