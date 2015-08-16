define(['jquery', 'plugins/ajax'], function ($, ajax) {

    return {
        init: function (playerId, authKey) {
            return ajax.callAjax('auth', { playerId: playerId, authKey: authKey });
        },

        loadRefs: function(){
            return ajax.callAjax('refs');
        },

        loadMe: function(id){
            return ajax.callAjax('self', { method: 'get' });
        },

        update: function(friends){
            return ajax.callAjax('self', { method: 'update', friends: friends });
        },

        loadTop: function(){
            return ajax.callAjax('top', null);
        },

        gymExecute: function(args){
            args.method = 'execute';
            return ajax.callAjax('gym', args);
        }

    }
});