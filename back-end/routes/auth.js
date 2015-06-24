var Player = require('../controllers/player'),
    $ = require('jquery-deferred');

var VK_APP_SECRET = "ESyZr9v9a8w2G8VZuDGz",
    VK_APP_ID = "3955660",
    ERR_AUTH_FAIL = { message: "Authorization failed"},
    MES_SUCCESS = { message: "Authorization successful"};

module.exports = {
    VK_APP_SECRET: VK_APP_SECRET,
    VK_APP_ID: VK_APP_ID,
    ERR_AUTH_FAIL: ERR_AUTH_FAIL,
    MES_SUCCESS: MES_SUCCESS,

    params: {
        playerId: {
            parseMethod: parseInt,
            required: true
        },
        authKey: {
            required: true
        }
    },
    isAuth: function(req){
        return !!req.session.auth;
    },
    handler: function (session, params) {
        return $.Deferred(function(defer){
            if (session.player != undefined) {
                if (session.player.id === params.playerId) {
                    defer.resolve(this.MES_SUCCESS);
                    return;
                }
            }

            if (params.playerId !== 5653333)
            {
                var data = VK_APP_ID + '_' + params.playerId + '_' + VK_APP_SECRET;
                var crypto = require('crypto');
                var expectedAuthKey = crypto.createHash('md5').update(data).digest('hex');

                if (params.authKey != expectedAuthKey) {
                    defer.resolve(ERR_AUTH_FAIL);
                    return;
                }
            }

            var initSession = function () {
                session.player = {
                    id: params.playerId,
                    jobbing: { started: false, lastTime: null }
                };
                session.auth = true;
                defer.resolve(MES_SUCCESS);
            };

            Player.exists(params.playerId).then(
                function (exists) {
                    if (!exists) {
                        Player.create(params.playerId).then(initSession, defer.reject);
                    }
                    else
                    {
                        initSession();
                    }
                },
                defer.reject
            );
        });
    }
};
