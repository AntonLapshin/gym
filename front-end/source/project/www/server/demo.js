define(['jquery', 'plugins/format'], function ($, vk, format) {

    var _USERS = [
        {
            "_id": 5653333,
            "score": 11000,
            "exp": 123,
            "goals": 123,
            "miss": 32,
            "last": new Date()
        },
        {
            "_id": 253300936,
            "score": 20546,
            "exp": 196,
            "goals": 1546,
            "miss": 11,
            "last": new Date()
        },
        {
            "_id": 229865556,
            "score": 18462,
            "exp": 127,
            "goals": 553,
            "miss": 341
        },
        {
            "_id": 159489458,
            "score": 17649,
            "exp": 86,
            "goals": 522,
            "miss": 129
        },
        {
            "_id": 60981233,
            "score": 17478,
            "exp": 49,
            "goals": 627,
            "miss": 0
        },
        {
            "_id": 243782603,
            "score": 17438,
            "exp": 75,
            "goals": 339,
            "miss": 79
        },
        {
            "_id": 5188175,
            "score": 17213,
            "exp": 54,
            "goals": 446,
            "miss": 8
        },
        {
            "_id": 233219052,
            "score": 17196,
            "exp": 58,
            "goals": 310,
            "miss": 116
        },
        {
            "_id": 147936855,
            "score": 17153,
            "exp": 52,
            "goals": 305,
            "miss": 24
        },
        {
            "_id": 128954165,
            "score": 17143,
            "exp": 31,
            "goals": 508,
            "miss": 0
        },
        {
            "_id": 191699661,
            "score": 17103,
            "exp": 58,
            "goals": 205,
            "miss": 57
        }
    ];

    return {
        init: function () {
            return $.Deferred(function (defer) {
                defer.resolve();
            })
        },

        loadUsers: function (ids) {
            var users = [];

            ids.forEach(function (id) {
                _USERS.forEach(function(user){
                    if (id === user._id)
                        users.push($.extend({}, user));
                });
            });

            return $.Deferred(function (defer) {
                defer.resolve(users);
            });
        },

        loadTopUsers: function () {
            return $.Deferred(function (defer) {
                defer.resolve([].concat(_USERS));
            });
        },

        saveUser: function(userSetExp){
            console.log('User is saved: ' + JSON.stringify(userSetExp));
        }
    }
});