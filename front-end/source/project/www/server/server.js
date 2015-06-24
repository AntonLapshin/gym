define(['jquery'], function($){

    var _server,
        _resuests = {
            loadTop: {
                lastDateTime: 0,
                data: null,
                timeout: 5 * 1000 * 60
            }
        };

    return {

        init: function(server){
            _server = server;
            return server.init();
        },

        loadMe: function(id){
            return _server.loadMe(id);
        },

        loadPlayers: function(ids){
            return _server.loadPlayers(ids);
        },

        loadTop: function(){
            return $.Deferred(function(defer){
                if (Date.now() - _resuests.loadTop.lastDateTime <= _resuests.loadTop.timeout){
                    defer.resolve(_resuests.loadTop.data);
                    return;
                }

                _server.loadTop().then(function(serverPlayers){
                    _resuests.loadTop.lastDateTime = Date.now();
                    _resuests.loadTop.data = serverPlayers;
                    defer.resolve(serverPlayers);
                });
            });
        },

        saveMe: function(playerSetExp){
            return _server.saveMe(playerSetExp);
        }
    }
});