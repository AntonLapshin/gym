define(['jquery'], function($){

    var _server,
        _resuests = {
            loadTopUsers: {
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

        loadUsers: function(ids){
            return _server.loadUsers(ids);
        },

        loadTopUsers: function(){
            if (Date.now() - _resuests.loadTopUsers.lastDateTime > _resuests.loadTopUsers.timeout){
                return $.Deferred(function(defer){
                    _server.loadTopUsers().then(function(serverUsers){
                        _resuests.loadTopUsers.lastDateTime = Date.now();
                        _resuests.loadTopUsers.data = serverUsers;
                        defer.resolve(serverUsers);
                    });
                });
            }

            return $.Deferred(function(defer){
                defer.resolve(_resuests.loadTopUsers.data);
            });
        },

        saveUser: function(userSetExp){
            return _server.saveUser(userSetExp);
        }
    }
});