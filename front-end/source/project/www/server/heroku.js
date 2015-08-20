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

        loadPlayer: function(id){
            return ajax.callAjax('self', { method: 'getPlayer', playerId: id });
        },

        setFriends: function(friends){
            return ajax.callAjax('self', { method: 'setFriends', friends: friends });
        },

        loadTop: function(){
            return ajax.callAjax('top', null);
        },

        workoutExecute: function(args){
            args.method = 'execute';
            return ajax.callAjax('workout', args);
        },

        jobGet: function(){
            return ajax.callAjax('job', { method: 'get' });
        },

        jobComplete: function(){
            return ajax.callAjax('job', { method: 'complete' });
        }

    }
});