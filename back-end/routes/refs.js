var Db = require('../db'),
    $ = require('jquery-deferred');

module.exports = {
    params: {},
    handler: function(){
        return $.Deferred(function(defer){
            defer.resolve(Db.getRefs());
        });
    }
};