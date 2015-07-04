define(['ko', 'server/server', 'social/social'], function (ko, server, social) {

    function merge(serverPlayers, socialPlayers){
        $.each(serverPlayers, function(i, serverPlayer){
            var socialPlayer = $.grep(socialPlayers, function(socialPlayer){
                return serverPlayer._id == socialPlayer.id;
            })[0];

            $.extend(serverPlayer, socialPlayer);
        });
        return serverPlayers;
    }

    function getMe(){
        return social.getMe().then(function (socialPlayer) {
            return $.Deferred(function (defer) {
                server.loadMe(socialPlayer.id)
                    .then(function (serverPlayer) {
                        defer.resolve(merge([serverPlayer], [socialPlayer])[0]);
                    });
            });
        });
    }

    function Player() {
        var self = this;

        this._id = ko.observable();
        this.private = {
            money: ko.observable(),
            energy: ko.observable(),
            friends: ko.observable(),
            energyMax: ko.observable(),
            reg: {
                lastUpdateTime: ko.observable(),
                lastCheckLevelUpTime: ko.observable()
            }
        };
        this.public = {
            level: ko.observable(),
            name: ko.observable(),
            img: ko.observable(),
            mass: ko.observable()
        };
        this.gyms = [];
        this.body = [];
        for(var i = 0; i < 16; i++) {
            this.body.push({
                _id: i,
                stress: ko.observable(0),
                frazzle: ko.observable(0)
            })
        }

        this.load = function(){
            return getMe().then(function(model){
                self._id(model._id);

                self.private.money(model.private.money);
                self.private.energy(model.private.energy);
                self.private.friends(model.private.friends);
                self.private.energyMax(model.private.energyMax);
                self.private.reg.lastUpdateTime = model.private.reg.lastUpdateTime;
                self.private.reg.lastCheckLevelUpTime = model.private.reg.lastCheckLevelUpTime;

                self.public.level(model.public.level);
                self.public.name(model.name);
                self.public.img(model.img);
                self.public.mass(model.public.level * 10);

                self.gyms = model.gyms;

                $.each(model.body, function(i, muscle){
                    self.body[i].stress(muscle.stress);
                    self.body[i].frazzle(muscle.frazzle);
                });
            });
        };
    }

    return Player;
});