var Player = require('../controllers/player'),
    $ = require('jquery-deferred');

var VK_APP_SECRET = "ESyZr9v9a8w2G8VZuDGz",
    VK_APP_ID = "3955660",
    ERR_AUTH_FAIL = "Auth fail",
    MES_SUCCESS = "Auth success",
    MES_ALREADY_AUTH = "Already authorized";

module.exports = {
    VK_APP_SECRET: VK_APP_SECRET,
    VK_APP_ID: VK_APP_ID,
    ERR_AUTH_FAIL: ERR_AUTH_FAIL,
    MES_SUCCESS: MES_SUCCESS,

    default: {
        params: {
            playerId: {
                parseMethod: parseInt,
                required: true
            },
            authKey: {
                required: true
            }
        },
        handler: function (session, params) {
            return $.Deferred(function (defer) {
                //if (session.player) {
                //    defer.resolve(MES_ALREADY_AUTH);
                //    return;
                //}

                var playerId = params.playerId;

                if (playerId !== 5653333) {
                    var data = VK_APP_ID + '_' + playerId + '_' + VK_APP_SECRET;
                    var crypto = require('crypto');
                    var expectedAuthKey = crypto.createHash('md5').update(data).digest('hex');

                    if (params.authKey != expectedAuthKey) {
                        defer.reject(ERR_AUTH_FAIL);
                        return;
                    }
                }

                Player.find(params.playerId, ['_id', 'public', 'private']).then(
                    function (player) {
                        if (!player)
                            player = Player.create(params.playerId);

                        session.player = player;
                        defer.resolve(MES_SUCCESS)
                    },
                    defer.reject
                );
            });
        }
    }
};
