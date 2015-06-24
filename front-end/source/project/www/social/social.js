define(function(){

    var _social;

    return {

        init: function(social){
            _social = social;
            return _social.init();
        },

        invite: function () {
            _social.invite();
        },

        showOrderBox: function(){
            return _social.showOrderBox();
        },

        getUserUrl: function(id){
            return _social.getUserUrl(id);
        },

        getUnknowImg: function(){
            return _social.getUnknowImg();
        },

        wallPost: function(place){
            return _social.wallPost(place);
        },

        getMe: function () {
            return _social.getMe();
        },

        getPlayers: function (ids) {
            return _social.getUsers(ids);
        },

        getFriends: function () {
            return _social.getFriends();
        },

        isUserInGroup: function (id) {
            return _social.isUserInGroup(id);
        },

        getCommunityHref: function(){
            return _social.getCommunityHref();
        }
    }
});