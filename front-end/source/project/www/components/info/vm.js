define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'plugins/localization'
], function(ko, html, component, strings) {

    var _viewModel = {
        user: ko.observable(null),
        scores: strings.scores,
        goals: strings.goals,
        exp: strings.exp,

        show: function(item){
            if (item.id == 0) return;
            this.user(item);
            this.isVisible(true);
        },

        hide: function(){
            this.user(this.defaultUser);
        },

        init: function(defaultUser){
            this.defaultUser = defaultUser;
            this.hide();
        },

        test: function(){
            var self = this;
            require(['controllers/users'], function (UsersController) {
                UsersController.getMe()
                    .then(function(user){
                        self.show(user);
                    });
            });
        }
    };

    return component.add(_viewModel, html, 'info');
});