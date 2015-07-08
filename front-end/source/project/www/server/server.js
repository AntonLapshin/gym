define(['jquery'], function($){

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
                    defer.resolve(data);
                });
            });
        },

        init: function(server){
            _server = server;
            return server.init();
        },

        loadRefs: function(){
            return this.proxy('loadRefs');
        },

        loadMe: function(id){
            return this.proxy('loadMe', id);
        },

        loadPlayers: function(ids){
            return this.proxy('loadPlayers', ids);
        },

        loadTop: function(){
            return this.proxy('loadTop');
        },

        saveMe: function(playerSetExp){
            return _server.saveMe(playerSetExp);
        },

        gymExecute: function(args){
            return _server.gymExecute(args);
        },

        jobGet: function(){
            return _server.jobGet();
        },

        jobComplete: function(){
            return _server.jobComplete();
        }

    }
});