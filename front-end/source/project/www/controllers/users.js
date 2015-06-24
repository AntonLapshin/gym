define(['server/server', 'social/social', 'plugins/localization'], function (server, social, strings) {

    function getPlayers(ids, idScoreDic) {
        var players = [];
        return social.getUsers(ids).then(function (users) {
            var players = [];
            for (var i = 0; i < users.length; i++) {
                players.push(newPlayer(users[i], idScoreDic[users[i].id]));
            }
            return players;
        });
    }

    function mergeUserData(serverUsers, socialUsers){
        serverUsers.forEach(function (serverUser) {
            socialUsers.forEach(function (socialUser) {
                if (socialUser.id == serverUser._id) {
                    socialUser.isMerged = true;
                    for (var name in socialUser) {
                        serverUser[name] = socialUser[name];
                    }
                }
            })
        });

        socialUsers.forEach(function(socialUser){
            if (socialUser.isMerged)
                return;

            serverUsers.push(newPlayer(socialUser))
        });
        return serverUsers;
    }

    function getIds(users){
        var ids = [];
        users.forEach(function (user) {
            ids.push(user.id || user._id);
        });
        return ids;
    }

    function getIdScoreDic(ids, scores) {
        var dic = {};
        for (var i = 0; i < ids.length; i++) {
            dic[ids[i]] = scores[ids[i]] || 0;
        }
        return dic;
    }

    function parseScores(scores) {
        var dic = {};
        for (var i = 0; i < scores.length; i++) {
            dic[scores[i]._id] = scores[i];
        }
        return dic;
    }

    function newPlayer(user, score) {
        user = user || {
            id: '0',
            img: social.getUnknowImg(),
            name: strings.txtInvite
        };

        score = score || {
            score: 0,
            goals: 0,
            miss: 0,
            exp: 0,
            last: 0
        };

        return {
            id: user.id,
            img: user.img,
            name: user.name,
            score: score.score,
            goals: score.goals,
            miss: score.miss,
            exp: score.exp,
            last: score.last
        };
    }

    return {

        newPlayer: newPlayer,

        getMe: function () {
            return social.getMe().then(function (socialUser) {
                return $.Deferred(function (defer) {
                    server.loadUsers([socialUser.id])
                        .then(function (serverUsers) {
                            defer.resolve(mergeUserData(serverUsers, [socialUser])[0]);
                        });
                });
            })
        },

        getTopUsers: function () {
            return server.loadTopUsers().then(function (serverUsers) {
                if (serverUsers.length == 0) {
                    return [];
                }

                return $.Deferred(function (defer) {
                    social.getUsers(getIds(serverUsers)).then(function (socialUsers) {
                        serverUsers = mergeUserData(serverUsers, socialUsers);
                        defer.resolve(serverUsers);
                    });
                });
            });
        },

        getFriendsUsers: function () {
            return social.getFriendsUsers().then(function (socialUsers) {
                if (socialUsers.length === 0) {
                    return [];
                }

                return $.Deferred(function (defer) {
                    server.loadUsers(getIds(socialUsers)).then(function (serverUsers) {
                        serverUsers = mergeUserData(serverUsers, socialUsers);
                        defer.resolve(serverUsers);
                    });
                });
            });
        }
    };
});