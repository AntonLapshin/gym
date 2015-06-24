define(['jquery', 'vk', 'plugins/format'], function ($, vk, format) {

    var ID_GROUP = '71627954',
        PHOTO = 'photo-71627954_332801553',
        APP_URL = 'https://vk.com/app4446829',
        MESSAGE = 'Занятое место на чемпионате мира: {0}. Попробуй свои силы в послематчевых пенальти на чемпионате мира 2014 {1}';


    function srcToHttps(src) {
        if (src.indexOf('http://cs') === -1) {
            return src.replace('http://', 'https://');
        }
        return "https://pp.vk.me/c" + src.replace("http://cs", "").replace(".vk.me", "");
    }

    function parseUser(data) {
        return { id: data.uid || data.id, img: srcToHttps(data.photo_50), name: data.first_name + ' ' + data.last_name };
    }

    return {
        init: function () {
            return $.Deferred(function (defer) {
                VK.init(function () {
                    defer.resolve();
                }, function () {
                }, '5.21');
            })
        },

        getUserUrl: function (id) {
            return 'https://vk.com/id' + id;
        },

        getUnknowImg: function () {
            return '//vk.com/images/deactivated_50.gif';
        },

        invite: function () {
            VK.callMethod('showInviteBox');
        },

        showOrderBox: function () {
            return $.Deferred(function (defer) {
                VK.addCallback('onOrderSuccess', function (order_id) {
                    defer.resolve();
                });
                VK.addCallback('onOrderFail', function () {
                    defer.reject('fail');
                });
                VK.addCallback('onOrderCancel', function () {
                    defer.reject('cancel');
                });

                VK.callMethod('showOrderBox', {
                    type: 'votes',
                    votes: 1
                });
            });
        },

        wallPost: function (place) {
            return $.Deferred(function (defer) {
                VK.api('wall.post', { attachments: PHOTO, message: format(MESSAGE, place, APP_URL)}, function (answer) {
                    defer.resolve(answer);
                });
            });
        },

        getMe: function(){
            var self = this;
            return $.Deferred(function(defer){
                VK.api('users.get', { user_ids: undefined, fields: 'photo_50', name_case: 'Nom' }, function(data){
                    if (!data || data.error)
                        defer.resolve();
                    var users = [];

                    if (!data.response) {
                        defer.resolve();
                        return;
                    }
                    data.response.forEach(function (userData) {
                        users.push(parseUser(userData));
                    });
                    defer.resolve(users[0]);
                });
            });
        },

        getUsers: function (ids) {
            return $.Deferred(function (defer) {

                if (ids && ids.length === 1)
                    ids = ids[0];

                function handler(data) {
                    if (!data || data.error || !data.response){
                        defer.resolve([]);
                        return;
                    }

                    var users = [];
                    data.response.forEach(function (userData) {
                        users.push(parseUser(userData));
                    });
                    defer.resolve(users);
                }

                VK.api('users.get', { user_ids: ids, fields: 'photo_50', name_case: 'Nom' }, handler);
            });
        },

        getFriendsUsers: function () {
            var self = this;
            return $.Deferred(function (defer) {
                VK.api('friends.getAppUsers', function (data) {
                    if (!data || !data.response || !data.response.length || data.response.length === 0){
                        defer.resolve([]);
                        return;
                    }
                    var ids = data.response;
                    self.getUsers(ids).then(function(socialUsers){
                        defer.resolve(socialUsers);
                    });
                });
            });
        },

        isUserInGroup: function (id) {
            return $.Deferred(function (defer) {
                VK.api('groups.isMember', { user_id: id, group_id: ID_GROUP }, function (data) {
                    defer.resolve(data.response.member === 1);
                });
            });
        },

        getCommunityHref: function(){
            return '//vk.com/club71627954';
        }
    }
});