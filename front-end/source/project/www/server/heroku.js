define(['jquery', 'plugins/ajax'], function ($, ajax) {

    return {
        init: function () {
            return $.Deferred(function (defer) {
                defer.resolve();
            })
        },

        loadUsers: function(ids){
            return ajax.callAjax('scores', { ids: ids })
        },

        loadTopUsers: function(){
            return ajax.callAjax('top', null);
        },

        saveUser: function(userSetExp){
            return ajax.callAjax('upsert', userSetExp);
        }
    }
});