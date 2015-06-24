define(['ko'], function (ko) {

    function Player() {
        this._id = ko.observable();
        this.jobbing = ko.observable();
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
            mass: ko.observable()
        };
        this.body = [];
        for(var i = 0; i < 16; i++){
            this.body.push({
                _id: i,
                stress: ko.observable(0),
                frazzle: ko.observable(0)
            })
        }
    }
});