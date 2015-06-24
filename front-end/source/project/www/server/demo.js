define(['jquery'], function ($) {

    var _ME = {
        _id: 5653333,
        jobbing: {
            nextTime: new Date()
        },
        private: {
            money: 200,
            energy: 65,
            energyMax: 100,
            reg: {
                lastUpdateTime: new Date(),
                lastCheckLevelUpTime: new Date()
            }
        },
        public: {
            level: 12
        },
        body: [
            {
                _id: 0,
                stress: 0.2,
                frazzle: 0.7
            },
            {
                _id: 1,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 2,
                stress: 0.3,
                frazzle: 0.1
            },
            {
                _id: 3,
                stress: 0.2,
                frazzle: 0.1
            },
            {
                _id: 4,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 5,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 6,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 7,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 8,
                stress: 0.5,
                frazzle: 0.6
            },
            {
                _id: 9,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 10,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 11,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 12,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 13,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 14,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 15,
                stress: 0,
                frazzle: 0
            }
        ]
    };

    var _PLAYERS = [
        {
            _id: 1,
            public: {
                level: 5
            }
        },
        {
            _id: 2,
            public: {
                level: 15
            }
        },
        {
            _id: 3,
            public: {
                level: 7
            }
        },
        {
            _id: 4,
            public: {
                level: 6
            }
        }
    ];

    return {
        init: function () {
            return $.Deferred(function (defer) {
                defer.resolve();
            })
        },

        loadMe: function(id){
            return $.Deferred(function (defer) {
                defer.resolve(_ME);
            });
        },

        loadPlayers: function (ids) {
            var players = $.grep([].concat(_PLAYERS), function () {
                return $.inArray(this._id, ids) !== -1;
            });

            return $.Deferred(function (defer) {
                defer.resolve(players);
            });
        },

        loadTop: function () {
            return $.Deferred(function (defer) {
                defer.resolve([].concat(_PLAYERS));
            });
        },

        saveUser: function (userSetExp) {
            console.log('User is saved: ' + JSON.stringify(userSetExp));
        }
    }
});