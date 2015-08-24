define(['jquery', 'plugins/format'], function ($, vk, format) {

    var ID_GROUP = '71627954';

    var _MYSELF = {
        "id": 5653333,
        "img": "https://pp.vk.me/c623220/v623220333/c060/4Np4xWzgxlU.jpg",
        "name": "Anton Lapshin"
    };

    var _PLAYERS = [
        {"id": 253300936, "img": "https://pp.vk.me/c618421/v618421936/12aa1/RTXvKzOd65E.jpg", "name": "Mikha Pogodin"},
        {"id": 229865556, "img": "https://pp.vk.me/c306409/v306409233/3581/UAvmuA-GaBo.jpg", "name": "Denis Shevchenko" },
        {"id": 159489458, "img": "https://pp.vk.me/c6011/v6011165/464/9qbDEij68Uc.jpg", "name": "Valentin Cherny"},
        {"id": 60981233, "img": "https://pp.vk.me/c620823/v620823043/190fc/LJjNunV8d7c.jpg", "name": "Anton Chaldaev"},
        {"id": 243782603, "img": "https://pp.vk.me/c407822/v407822609/b820/bWlD4bP140g.jpg", "name": "Andrey Moerchuk"},
        {"id": 5188175, "img": "https://pp.vk.me/c616030/v616030119/17bb4/-Mf2RNRB04k.jpg", "name": "Marsel Khakimov"},
        {"id": 5653333, "img": "https://pp.vk.me/c619116/v619116629/17703/4Und2nzDjzI.jpg", "name": "Anton Lapshin"},
        {"id": 233219052, "img": "https://pp.vk.me/c619420/v619420700/b913/i5LtaPd0NCg.jpg", "name": "Andriy Rozman"},
        {"id": 147936855, "img": "https://pp.vk.me/c619116/v619116629/17703/4Und2nzDjzI.jpg", "name": "Danik Boychuk"},
        {"id": 128954165, "img": "https://pp.vk.me/c614726/v614726005/202ac/f9GMc_cX_CY.jpg","name": "Kristian Gitsba" },
        {"id": 191699661, "img": "https://pp.vk.me/c319424/v319424721/df64/VjDpInEQtuM.jpg", "name": "Pavel Taratynov"},
        {"id": 43065119, "img": "https://pp.vk.me/c616030/v616030119/17bb4/-Mf2RNRB04k.jpg", "name": "Marsel Khakimov"},
        {"id": 140340700, "img": "https://pp.vk.me/c619420/v619420700/b913/i5LtaPd0NCg.jpg", "name": "Andriy Rozman"},
        {"id": 169565629, "img": "https://pp.vk.me/c619116/v619116629/17703/4Und2nzDjzI.jpg", "name": "Danik Boychuk"},
    ];

    function srcToHttps(src) {
        if (src.indexOf('http://cs') === -1) {
            return src.replace('http://', 'https://');
        }
        return "https://pp.vk.me/c" + src.replace("http://cs", "").replace(".vk.me", "");
    }

    function parseUser(data) {
        return {id: data.uid || data.id, img: srcToHttps(data.photo_50), name: data.first_name + ' ' + data.last_name};
    }

    return {
        init: function () {
            return $.Deferred(function (defer) {
                defer.resolve();
            })
        },

        invite: function () {
            alert('showInviteBox');
        },

        showOrderBox: function () {
            return $.Deferred(function (defer) {
                window.setTimeout(defer.resolve, 500);
            });
        },

        getUserUrl: function (id) {
            return 'https://vk.com/id' + id;
        },

        getUnknowImg: function () {
            return '//vk.com/images/deactivated_50.gif';
        },

        wallPost: function (place) {
            return $.Deferred(function (defer) {
                alert('show Wall Post');
                window.setTimeout(defer.resolve, 500);
            });
        },

        getMe: function () {
            return $.Deferred(function (defer) {
                defer.resolve(_MYSELF);
            });
        },

        getPlayer: function (id) {
            return $.Deferred(function (defer) {
                defer.resolve($.grep(_PLAYERS, function (p) {
                    return p.id === id;
                })[0]);
            });
        },

        getPlayers: function (ids) {
            var players = $.grep([].concat(_PLAYERS), function (p) {
                return $.inArray(p.id, ids) !== -1;
            });

            return $.Deferred(function (defer) {
                defer.resolve(players);
            });
        },

        getFriends: function () {
            var __PLAYERS = [].concat(_PLAYERS);
            var players = [__PLAYERS[0], __PLAYERS[1], __PLAYERS[2]];
            return $.Deferred(function (defer) {
                defer.resolve(players);
            });
        },

        getFriendsQty: function () {
            return $.Deferred(function (defer) {
                defer.resolve(3);
            });
        },

        isUserInGroup: function (id) {
            return $.Deferred(function (defer) {
                VK.api('groups.isMember', {user_id: id, group_id: ID_GROUP}, function (data) {
                    defer.resolve(data.response.member === 1);
                });
            });
        },

        getCommunityHref: function () {
            return 'http://google.com/';
        }
    }
});