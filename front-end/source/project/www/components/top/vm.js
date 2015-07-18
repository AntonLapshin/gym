define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'c/member/vm',
    'model/game',
    'model/player',
    'server/server',
    'social/social',
    'c/sw/vm'
], function (ko, $, html, c, member, game, Player, server, social, sw) {

    var MAX_VISIBLE_PLAYERS = 9;

    function sortRule(a, b) {
        return b.public.level - a.public.level;
    }

    function getIds(users){
        var ids = [];
        users.forEach(function (user) {
            ids.push(user.id || user._id);
        });
        return ids;
    }

    function merge(serverPlayers, socialPlayers){
        $.each(serverPlayers, function(i, serverPlayer){
            var socialPlayer = $.grep(socialPlayers, function(socialPlayer){
                return serverPlayer._id == socialPlayer.id;
            })[0];

            $.extend(serverPlayer.public, socialPlayer);
        });
        return serverPlayers;
    }

    function getTopUsers() {
        return server.loadTop().then(function (serverUsers) {
            if (serverUsers.length == 0) {
                return [];
            }

            return $.Deferred(function (defer) {
                social.getPlayers(getIds(serverUsers)).then(function (socialUsers) {
                    serverUsers = merge(serverUsers, socialUsers);
                    defer.resolve(serverUsers);
                });
            });
        });
    }

    function getFriendsUsers() {
        return social.getFriends().then(function (socialUsers) {
            if (socialUsers.length === 0) {
                return [];
            }

            return $.Deferred(function (defer) {
                server.loadPlayers(getIds(socialUsers)).then(function (serverUsers) {
                    serverUsers = merge(serverUsers, socialUsers);
                    defer.resolve(serverUsers);
                });
            });
        });
    }

    var _mode;

    function ViewModel() {
        var self = this;

        this.strings = c.strings;
        this.myself = null;
        this.visibleMembers = ko.observableArray();
        this.page = ko.observable(0);
        this.members = ko.observableArray();

        this.init = function(){

            sw('top').show().init().progress(function (state) {
                if (state)
                    self.toFriendsTop();
                else
                    self.toAllTop()
            });

            self.myself = game.player;

            return self;
        };

        this.setVisibleMembers = function (members) {
            if (_mode === "friends")
                members = [this.myself].concat(members);

            members.sort(sortRule);
            members.forEach(function (user, index) {
                user.place = _mode === "top" ? index : undefined;
            });

            this.members(members);

            var result = [];
            for (var i = this.page() * MAX_VISIBLE_PLAYERS, j = 0; i < members.length && j < MAX_VISIBLE_PLAYERS; i++, j++) {
                result.push(members[i]);
            }
            for (; i < MAX_VISIBLE_PLAYERS; i++) {
                result.push(Player(-1));
            }
            this.visibleMembers([]);
            this.visibleMembers(result);
        };

        this.toAllTop = function() {
            _mode = "top";
            this.getMembers(getTopUsers);
        };

        this.toFriendsTop = function () {
            _mode = "friends";
            this.getMembers(getFriendsUsers);
        };

        this.getMembers = function (method) {
            var self = this;
            method().then(function (members) {
                self.setVisibleMembers(members);
            });
        };

        this.nextEnabled = ko.computed(function(){
            return self.page() < Math.floor(self.members() / MAX_VISIBLE_PLAYERS);
        }, this);

        this.prevEnabled = ko.computed(function(){
            return self.page() > 0;
        }, this);

        this.next = function(){
            self.page(self.page() + 1);
            self.setVisibleMembers(self.members());
        };

        this.prev = function(){
            this.page(this.page() - 1);
            self.setVisibleMembers(self.members());
        };

        this.test = function () {
            this.show().init();
            this.toAllTop();
        };
    }

    return c.add(ViewModel, html, 'top');
});