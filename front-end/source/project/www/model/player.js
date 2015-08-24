define(['ko', 'server/server', 'social/social', 'c'], function (ko, server, social, c) {

    function merge(serverPlayers, socialPlayers){
        $.each(serverPlayers, function(i, serverPlayer){
            var socialPlayer = $.grep(socialPlayers, function(socialPlayer){
                return serverPlayer._id == socialPlayer.id;
            })[0];

            $.extend(serverPlayer.public, socialPlayer);
        });
        return serverPlayers;
    }

    // Private + Public
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

    // Public
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

    var updateValues = {};

    function updateValue(name, field, value){
        if (value != null){
            updateValues[name] = value;
        }
        else {
            value = updateValues[name];
        }

        if (value == null)
            return;
        var oldValue = field() || 0;
        if (oldValue === value)
            return;
        var newValue = oldValue + (value > oldValue ? 1 : -1);
        field(newValue);
        var delay = Math.abs(value - newValue) > 50 ? 1 :
            Math.pow(Math.min(value, newValue) / Math.max(value, newValue), 2) * 50;

        setTimeout(function(){
            updateValue(name, field);
        }, delay);
    }

    function PlayerPublic(id, self){
        self = self || this;

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
            self.public.name = model.public.name;
            self.public.img = model.public.img;
            self.public.mass(model.public.level * 10);
            self.public.exercises = model.public.exercises;
        };

        self.load = function(){
            return getPlayer(id).then(self.loadPublic);
        };

    }

    function PlayerPrivate(){
        var self = this;

        PlayerPublic(null, this);

        this.private = {
            money: ko.observable(),
            gold: ko.observable(),
            energy: ko.observable(0),
            friends: ko.observable(),
            energyMax: ko.observable(),
            gyms: [],
            achievements: [],
            body: []
        };
        for(var i = 0; i < 16; i++) {
            this.private.body.push({
                _id: i,
                stress: ko.observable(0),
                frazzle: ko.observable(0)
            })
        }

        c.on('player.load', function(){
            self.load();
        });

        window.player = self;

        window.setInterval(function(){
            self.load();
        }, window.cfg.updatePeriod * 1000);

        this.load = function(){
            return getMe().then(function(model){
                self.loadPublic(model);

                // private
                updateValue('money', self.private.money, model.private.money);
                updateValue('energy', self.private.energy, model.private.energy);
                updateValue('gold', self.private.gold, model.private.gold);
                updateValue('friends', self.private.friends, model.private.friends);
                updateValue('level', self.public.level, model.public.level);
                self.private.energyMax(model.private.energyMax);
                self.private.gyms = model.private.gyms;
                self.private.achievements = model.private.achievements;
                $.each(model.private.body, function(i, muscle){
                    self.private.body[i].stress(muscle.stress);
                    self.private.body[i].frazzle(muscle.frazzle);
                });

                // Update friends
                social.getFriendsQty().then(function(friends){
                    if (friends !== model.private.friends) {
                        updateValue('friends', self.private.friends, friends);
                        server.setFriends(friends);
                    }
                });

                c.fire('player.updated', self);
            });
        };

        this.updateValue = updateValue;
    }

    function Player(id) {
        return id ? new PlayerPublic(id) : new PlayerPrivate();
    }

    return Player;
});