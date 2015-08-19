define(['jquery', 'c'], function($, c){

    var _server,
        _requests = {
            loadTop: {
                lastDateTime: 0,
                data: null,
                timeout: 5 * 1000 * 60
            },
            loadRefs: {
                lastDateTime: 0,
                data: null,
                timeout: 60 * 1000 * 60
            },
            loadMe: {
                lastDateTime: 0,
                data: null,
                timeout: 1000 * 5
            }
        };

    return {

        proxy: function(){
            var funcName = [].shift.apply(arguments);
            var args = arguments;
            return $.Deferred(function(defer){
                if (_requests[funcName])
                    if (Date.now() - _requests[funcName].lastDateTime <= _requests[funcName].timeout){
                        defer.resolve(_requests[funcName].data);
                        return;
                    }

                _server[funcName].apply(_server, args).then(function(data){
                    if (_requests[funcName]) {
                        _requests[funcName].lastDateTime = Date.now();
                        _requests[funcName].data = data;
                    }
                    c.fire('server.response', data);
                    defer.resolve(data);
                }, function(error){
                    c.fire('server.error', error);
                });
            });
        },

        init: function(server, playerId, authKey){
            _server = server;
            return server.init(playerId, authKey);
        },

        loadRefs: function(){
            return this.proxy('loadRefs');
        },

        loadMe: function(id){
            return this.proxy('loadMe', id);
        },

        loadPlayer: function(id){
            return this.proxy('loadPlayer', id);
        },

        loadPlayers: function(ids){
            return this.proxy('loadPlayers', ids);
        },

        loadTop: function(){
            return this.proxy('loadTop');
        },

        setFriends: function(friends){
            return this.proxy('setFriends', friends);
        },

        workoutExecute: function(args){
            return this.proxy('workoutExecute', args);
        },

        jobGet: function(){
            return this.proxy('jobGet');
        },

        jobComplete: function(){
            return this.proxy('jobComplete');
        }

    }
});