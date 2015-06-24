define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/member/vm',
    'controllers/users',
    'plugins/localization'
], function (ko, html, component, member, UsersController, strings) {

    var MAX_VISIBLE_PLAYERS = 9;

    function sortRule(a, b) {
        return b.score - a.score;
    }

    var _mode;

    var _viewModel = {
        isVisible: ko.observable(false),

        myself: null,
        users: ko.observableArray(),
        visibleUsers: ko.observableArray(),
        page: ko.observable(0),
        linkTopFriends: strings.linkTopFriends,
        linkTopAll: strings.linkTopAll,

        show: function (myself) {
            this.myself = myself;
            this.toFriendsTop();
            this.isVisible(true);
        },

        setVisibleUsers: function (users) {
            if (_mode === "friends")
                users = [this.myself].concat(users);

            users.sort(sortRule);
            users.forEach(function (user, index) {
                user.place = _mode === "top" ? index : undefined;
            });

            this.users(users);

            var result = [];
            for (var i = this.page() * MAX_VISIBLE_PLAYERS, j = 0; i < this.users().length && j < MAX_VISIBLE_PLAYERS; i++, j++) {
                result.push(this.users()[i]);
            }
            for (; i < MAX_VISIBLE_PLAYERS; i++) {
                result.push(UsersController.newPlayer())
            }
            this.visibleUsers(result);
        },

        toAllTop: function () {
            _mode = "top";
            this.getUsers(UsersController.getTopUsers);
        },

        toFriendsTop: function () {
            _mode = "friends";
            this.getUsers(UsersController.getFriendsUsers);
        },

        getUsers: function (method) {
            var self = this;
            method().then(function (users) {
                self.setVisibleUsers(users);
            });
        },

        test: function () {
            var self = this;

            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            UsersController.getMe()
                .then(function (user) {
                    self.show(user);
                });
        }
    };

    return component.add(_viewModel, html, 'top');
});