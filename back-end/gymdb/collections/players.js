exports.ENERGY_MAX = 100;
exports.START_MONEY = 125;

exports.newPlayer = function (id, level) {
    return {
        _id: id,
        job: {
            nextTime: new Date()
        },
        private: {
            money: exports.START_MONEY,
            energy: exports.ENERGY_MAX,
            energyMax: exports.ENERGY_MAX,
            reg: {
                lastUpdateTime: new Date(),
                lastCheckLevelUpTime: new Date()
            }
        },
        public: {
            level: level
        },
        gyms: [0],
        body: [
            {
                _id: 0,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 1,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 2,
                stress: 0,
                frazzle: 0
            },
            {
                _id: 3,
                stress: 0,
                frazzle: 0
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
                stress: 0,
                frazzle: 0
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
};

var player0 = exports.newPlayer(0, 120);
var player1 = exports.newPlayer(1, 2);
var player2 = exports.newPlayer(2, 6);
var player3 = exports.newPlayer(3, 3);
var player4 = exports.newPlayer(4, 7);
var player5 = exports.newPlayer(5, 10);
var player6 = exports.newPlayer(6, 10);
var player7 = exports.newPlayer(7, 10);
var player8 = exports.newPlayer(8, 10);
var player5653333 = exports.newPlayer(5653333, 120);

exports.players = [
    player0, player1, player2, player3, player4, player5, player6, player7, player8, player5653333
];