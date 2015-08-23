exports.ENERGY_MAX = 100;
exports.START_MONEY = 125;
exports.START_GOLD = 5;

exports.newPlayer = function (id, level) {
    var p = {
        _id: id,
        public: {
            level: level,
            awards: [],
            exercises: []
        },
        private: {
            friends: 0,
            gold: 5,
            money: exports.START_MONEY,
            energy: exports.ENERGY_MAX,
            energyMax: exports.ENERGY_MAX,
            reg: {
                lastUpdateTime: new Date(),
                lastCheckLevelUpTime: new Date()
            },
            job: {
                nextTime: new Date()
            },
            achievements: [],
            gyms: [],
            //factors: [], TBD
            body: []
        }
    };

    for(var i = 0; i <= 15; i++){
        p.private.body.push({
            _id: i,
            stress: 0,
            frazzle: 0
            //damage: 0, TBD
            //tonus: 0 TBD
        });
    }

    return p;
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
var player5653333 = exports.newPlayer(5653333, 0);

exports.players = [
    player0, player1, player2, player3, player4, player5, player6, player7, player8, player5653333
];