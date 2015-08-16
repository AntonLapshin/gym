var Player = require('../controllers/player'),
    $ = require('jquery-deferred');

module.exports = {
    default: {
        handler: function (session) {
            return Player.top();
        }
    }
};
