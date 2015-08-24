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

var p0 = exports.newPlayer(253300936, 120);
var p1 = exports.newPlayer(229865556, 0);
var p2 = exports.newPlayer(159489458, 0);
var p3 = exports.newPlayer(60981233, 0);
var p4 = exports.newPlayer(243782603, 0);
var p5 = exports.newPlayer(5188175, 1);
var p6 = exports.newPlayer(233219052, 2);
var p7 = exports.newPlayer(147936855, 2);
var p8 = exports.newPlayer(128954165, 3);
var p9 = exports.newPlayer(191699661, 3);
var p10 = exports.newPlayer(43065119, 3);
var p5653333 = exports.newPlayer(5653333, 0);

exports.players = [
    p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p5653333
];