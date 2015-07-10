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

    function getPlayer(id){
        return social.getPlayer(id).then(function (socialPlayer) {
            return $.Deferred(function (defer) {
                server.loadPlayer(socialPlayer.id)
                    .then(function (serverPlayer) {
                        defer.resolve(merge([serverPlayer], [socialPlayer])[0]);
                    });
            });
        });
    }

    function updateValue(field, value){
        if (!value)
            return;
        var oldValue = field() || 0;
        if (oldValue === value)
            return;
        var newValue = oldValue + (value > oldValue ? 1 : -1);
        field(newValue);
        var delay = Math.abs(value - newValue) > 50 ? 1 :
            Math.pow(Math.min(value, newValue) / Math.max(value, newValue), 2) * 50;
        setTimeout(function(){
            updateValue(field, value);
        }, delay);
    }

    function PlayerPublic(id, self){
        var self = self || this;

        self._id = id;
        self.public = {
            level: ko.observable(),
            name: null,
            img: null,
            mass: ko.observable(),
            exercises: []
        };

        self.loadPublic = function(model){
            self._id = model._id;
            self.public.level(model.public.level);
            self.public.name = model.name;
            self.public.img = model.img;
            self.public.mass(model.public.level * 10);
            self.public.exercises = model.public.exercises;
        };

        self.load = function(){
            return getPlayer(id).then(function(model){
                self.loadPublic(model);
            });
        };

    }

    function PlayerPrivate(){
        var self = this;

        PlayerPublic(null, this);

        this.private = {
            money: ko.observable(),
            energy: ko.observable(),
            friends: ko.observable(),
            energyMax: ko.observable(),
            gyms: [],
            body: []
        };
        for(var i = 0; i < 16; i++) {
            this.private.body.push({
                _id: i,
                stress: ko.observable(0),
                frazzle: ko.observable(0)
            })
        }

        this.load = function(){
            return getMe().then(function(model){
                self.loadPublic(model);

                // private
                updateValue(self.private.money, model.private.money);
                updateValue(self.private.energy, model.private.energy);
                updateValue(self.private.friends, model.private.friends);
                self.private.energyMax(model.private.energyMax);
                self.private.gyms = model.private.gyms;
                $.each(model.private.body, function(i, muscle){
                    self.private.body[i].stress(muscle.stress);
                    self.private.body[i].frazzle(muscle.frazzle);
                });
            });
        };

        this.updateValue = updateValue;
    }

    function Player(id) {
        return id ? new PlayerPublic(id) : new PlayerPrivate();
    }

    return Player;
});