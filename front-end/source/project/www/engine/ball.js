define(['jquery', 'physics', 'engine/points', 'plugins/loader'], function ($, Physics, Points, loader) {

    function random(min, max) {
        return (Math.random() * (max - min) + min) | 0
    }

    function getRandomVector(round) {
        var v = vectors[round];
        return new Physics.vector(
            v[random(0, v.length)]
        ).mult(STRENGTH_KOEFF);
    }

    var vectors = [
        [
            // Good
            { x: -69, y: -187 },
            { x: 0, y: -200 },
            { x: 69, y: -187 },

            // Normal
            { x: -50, y: -180 },
            { x: -25, y: -190 },
            { x: -10, y: -187 },
            { x: 50, y: -180 },
            { x: 25, y: -190 },
            { x: 10, y: -187 },

            // Poor
            { x: -50, y: -160 },
            { x: -25, y: -170 },
            { x: -10, y: -157 },
            { x: 50, y: -160 },
            { x: 25, y: -170 },
            { x: 10, y: -157 },

            // Crossbar
            { x: -75, y: -187 },
            { x: 75, y: -187 },

            // Out
            { x: -95, y: -217 },
            { x: 95, y: -217 },

        ],
        [
            // Good
            { x: -69, y: -187 },
            { x: 0, y: -200 },
            { x: 69, y: -187 },

            // Normal
            { x: -50, y: -180 },
            { x: -25, y: -190 },
            { x: -10, y: -187 },
            { x: 50, y: -180 },
            { x: 25, y: -190 },
            { x: 10, y: -187 },

            // Poor
            { x: -50, y: -160 },
            { x: -25, y: -170 },
            { x: -10, y: -157 },
            { x: 50, y: -160 },
            { x: 25, y: -170 },
            { x: 10, y: -157 },

            // Crossbar
            { x: -75, y: -187 },
            { x: 75, y: -187 },
        ],
        [
            // Good
            { x: -69, y: -187 },
            { x: 0, y: -200 },
            { x: 69, y: -187 },

            // Normal
            { x: -50, y: -180 },
            { x: -25, y: -190 },
            { x: -10, y: -187 },
            { x: 50, y: -180 },
            { x: 25, y: -190 },
            { x: 10, y: -187 },

            // Poor
            { x: -50, y: -160 },
            { x: -25, y: -170 },
            { x: -10, y: -157 },
            { x: 50, y: -160 },
            { x: 25, y: -170 },
            { x: 10, y: -157 },
        ],
        [
            // Good
            { x: -69, y: -187 },
            { x: 0, y: -200 },
            { x: 69, y: -187 },

            // Normal
            { x: -50, y: -180 },
            { x: -25, y: -190 },
            { x: 50, y: -180 },
            { x: 25, y: -190 },
        ]
    ];

    var STRENGTH_KOEFF = 0.005,
        NOISE_KOEFF = 0.005,
        SIZE = 12,
        MASS = 1,
        RESTITUTION = 0.9,
        COFF = 0.5;

    var _world,
        _ball$;

    function newBall() {
        if (_world.ball)
            _world.remove(_world.ball);

        var ball = Physics.body('circle', {
            x: 0,
            y: 0,
            radius: SIZE,
            mass: MASS,
            cof: COFF,
            restitution: RESTITUTION
        });

        ball.view = _ball$[0];
        ball.name = 'ball';

        _world.add(ball);
        _world.ball = ball;
        return ball;
    }

    return {
        getRandomVector: function(){
            return getRandomVector(_world.round);
        },

        toStart: function () {
            var ball = newBall();
            ball.state.pos.x = Points.PenaltyBall.x + random(0, 10) - 5;
            ball.state.pos.y = Points.PenaltyBall.y + random(0, 10) - 5;
            _world.clearLayer('ball');
        },

        strike: function (vector, psychicVector) {
            var strikeVector;

            if (_world.isAttack) {
                var vectorNoise = new Physics.vector(random(0, 10) - 5, random(0, 10) - 5).mult(NOISE_KOEFF);
                strikeVector = vector.clone().mult(STRENGTH_KOEFF).vadd(vectorNoise);
            }
            else {
                strikeVector = psychicVector || this.getRandomVector();
            }
            _world.ball.accelerate(strikeVector);
            _world.ball.strikeVector = strikeVector;
        },

        init: function (world) {
            _world = world;
            _ball$ = loader.getFile('ball').image$;
            var ballLayer = world._renderer.addLayer('ball', undefined, { manual: true, zIndex: 2 }),
                ctx = world._renderer.layer('ball').ctx;

            world.on('render', function (data) {
                if (world.ball && world.ball.oldPos === undefined){
                    world.ball.oldPos = world.ball.state.pos.clone();
                }

                if (world.state === 'strike' && world.ball && world.ball.oldPos){
                    var pos = world.getPosRel(world.ball.state.pos);
                    var diff = world.getLength(pos.vsub(world.ball.oldPos));
                    if (diff < 20) return;

                    ctx.globalAlpha = 0.2;
                    ctx.beginPath();
                    ctx.arc(world.ball.oldPos.x, world.ball.oldPos.y, 12, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    ctx.closePath();
                    ctx.globalAlpha = 1;
                    world.ball.oldPos = world.ball.state.pos.clone();
                }
            });
        }
    };
});