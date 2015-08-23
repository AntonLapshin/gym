var Db = require('../db'),
    PlayersCollection = require('../gymdb/collections/players'),
    $ = require('jquery-deferred');

var LIMIT_TOP_PLAYERS = 100;

module.exports = {
    create: function(id){
        var p = PlayersCollection.newPlayer(id, 0);
        Db.insert('players', p);
        return p;
    },
    update: function(id, updateClause){
        return Db.update('players', id, updateClause);
    },
    exists: function(id){
        return Db.exists('players', id);
    },
    find: function(id, shown){
        return Db.find('players', id, shown);
    },
    remove: function(id){
        return Db.remove('players', id);
    },
    top: function(){
        return $.Deferred(function (defer) {
            Db.getColl('players').find({$query: {}, $orderby: {'public.level': -1}}, {_id: 1, public: 1})
                .limit(LIMIT_TOP_PLAYERS)
                .toArray(function (err, data) {
                    $.handle(err, data, defer);
                });
        });
    }
};