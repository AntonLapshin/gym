define(['jquery', 'physics', 'engine/points', 'plugins/loader'], function ($, Physics, Points, loader) {

    var isView = true,
        _isNeedToReset;

    function random(min, max) {
        return (Math.random() * (max - min) + min) | 0
    }

    var STRENGTH_KOEFF = 0.0015,
        SIZE = 30,
        MASS = 100,
        RESTITUTION = 0.1,
        COFF = 0.1,
        SPEED_DELTA = 0.1,
        HAND_SIZE = 5,
        HAND_LENGTH = 50,
        JUMP_STREGTH = 0.0085,
        PENALTY_LENGTH = 650;

    var pent = [
        { x: 50, y: 0 }
        ,{ x: 25, y: -25 }
        ,{ x: -25, y: -25 }
        ,{ x: -50, y: 0 }
        ,{ x: 0, y: 50 }
    ];

    var LEFT_ARM_VERT = [
            { x: -15, y: 2},
            { x: -15, y: -2},
            { x: 30, y: -2},
            { x: 30, y: 2}
        ],
        RIGHT_ARM_VERT = [
            { x: 15, y: 2},
            { x: 15, y: -2},
            { x: -30, y: -2},
            { x: -30, y: 2}
        ],
        GOALKEEPER_VERT = [
            { x: -25, y: 0},
            { x: 0, y: -15},
            { x: 25, y: 0},
            { x: 0, y: 15}
        ];

    var _world,
        _goalkeeper,
        head$,
        leftHand$,
        rightHand$,
        tick = 0;

    function balance(){
        if (_world.state === 'strike')
            return;
        var x = Points.GoalkeeperStart.x,
            y = Points.GoalkeeperStart.y;

        if (_goalkeeper.head.state.pos.x >= x)
            _goalkeeper.leftHand.accelerate(new Physics.vector(-SPEED_DELTA, 0));
        else if(_goalkeeper.head.state.pos.x < x)
            _goalkeeper.rightHand.accelerate(new Physics.vector(SPEED_DELTA, 0));

        if (_goalkeeper.head.state.pos.y >= y)
            _goalkeeper.back.accelerate(new Physics.vector(0, -SPEED_DELTA*0.1));
        else if(_goalkeeper.head.state.pos.y < y)
            _goalkeeper.back.accelerate(new Physics.vector(0, SPEED_DELTA*0.1));
    }

    function newGoalkeeper(){
        if (_world.goalkeeper){
            _world.remove(_world.goalkeeper.head);
            _world.remove(_world.goalkeeper.leftHand);
            _world.remove(_world.goalkeeper.rightHand);
            _world.remove(_world.goalkeeper.back);
        }

        var head = Physics.body('circle', {
            x: Points.GoalkeeperStart.x,
            y: Points.GoalkeeperStart.y,
            radius: SIZE,
            mass: MASS,
            cof: COFF,
            restitution: RESTITUTION
        });

        var leftHand = Physics.body('circle', {
            x: Points.GoalkeeperStart.x - HAND_LENGTH,
            y: Points.GoalkeeperStart.y,
            radius: 15,
            mass: MASS,
            cof: COFF,
            restitution: RESTITUTION
        });

        var rightHand = Physics.body('circle', {
            x: Points.GoalkeeperStart.x + HAND_LENGTH,
            y: Points.GoalkeeperStart.y,
            radius: 15,
            mass: MASS,
            cof: COFF,
            restitution: RESTITUTION
        });

        var back = Physics.body('circle', {
            x: Points.GoalkeeperStart.x,
            y: Points.GoalkeeperStart.y - HAND_LENGTH,
            radius: HAND_SIZE,
            mass: MASS,
            cof: COFF,
            restitution: RESTITUTION,
            hidden: true
        });

        _goalkeeper = {
            head: head,
            leftHand: leftHand,
            rightHand: rightHand,
            back: back
        };

        if (isView === true){
            head.view = head$[0];
            leftHand.view = leftHand$[0];
            rightHand.view = rightHand$[0];
        }
        leftHand.name = rightHand.name = 'hand';
        back.class = head.class = leftHand.class = rightHand.class = 'goalkeeper';

        var rigidConstraints = Physics.behavior('verlet-constraints', {
            iterations: 3
        });

        rigidConstraints.distanceConstraint(head, leftHand, 0.2);
        rigidConstraints.distanceConstraint(head, rightHand, 0.2);
        rigidConstraints.distanceConstraint(leftHand, back, 0.01);
        rigidConstraints.distanceConstraint(rightHand, back, 0.01);
        rigidConstraints.distanceConstraint(head, back, 0.01);

        _world.add(head);
        _world.add(leftHand);
        _world.add(rightHand);
        _world.add(back);
        _world.add(rigidConstraints);
        _world.goalkeeper = _goalkeeper;
    }

    return {

        toStart: function(){
            newGoalkeeper();
            _isNeedToReset = true;
            _world.clearLayer('goalkeeper');
        },

        catch: function(){
            var ballVel = _world.ball.state.vel;
            var decreaseVel = ballVel.clone().mult(0.9);
            _world.ball.state.vel.vsub(decreaseVel);
        },

        jump: function(strikeVector, randomVector, isPsychic){
            var jumpVector,
                rndNoise;
            if (_world.isAttack){
                if (_world.round === 0 || isPsychic){
                    strikeVector = randomVector;
                }
                else if (_world.round === 1){
                    rndNoise = new Physics.vector(random(5, 25), 0);
                    if (strikeVector.x < 0){
                        strikeVector.vadd(rndNoise);
                    }
                    else{
                        strikeVector.vsub(rndNoise);
                    }
                }
                else if (_world.round === 2){
                    rndNoise = new Physics.vector(random(5, 18), 0);
                    if (strikeVector.x < 0){
                        strikeVector.vadd(rndNoise);
                    }
                    else{
                        strikeVector.vsub(rndNoise);
                    }
                }
                else if (_world.round === 3){
                    rndNoise = new Physics.vector(random(0, 15), 0);
                    if (strikeVector.x < 0){
                        strikeVector.vadd(rndNoise);
                    }
                    else{
                        strikeVector.vsub(rndNoise);
                    }
                }
                var strikeStrength = _world.getVectorLength(strikeVector);
                var posStart = _goalkeeper.head.state.pos;
                var posEnd = _world.ball.state.pos.clone().vadd(strikeVector.clone().normalize().mult(PENALTY_LENGTH));
                jumpVector = posEnd.vsub(posStart).mult(JUMP_STREGTH);
            }
            else{
                var ballVector = _world.ball.strikeVector;
                var posStart = _goalkeeper.head.state.pos;
                var posEnd = _world.ball.state.pos.clone().vadd(ballVector.clone().normalize().mult(PENALTY_LENGTH));
//                var idealJumpVector = posEnd.vsub(posStart).mult(JUMP_STREGTH);
                var realJumpVector = strikeVector.mult(JUMP_STREGTH);
//                var dx = idealJumpVector.x - realJumpVector.x;
//                if (Math.abs(dx) > 2){
//                    realJumpVector.x += (dx - 1);
//                }
                jumpVector = realJumpVector;
            }

            if (jumpVector.x < 0){
                _goalkeeper.leftHand.accelerate(jumpVector);
            }
            else if (jumpVector.x > 0)
            {
                _goalkeeper.rightHand.accelerate(jumpVector);
            }
        },

        action: function(self){
            var distance = self.goalkeeper.state.pos.x - Points.GoalkeeperStart.x,
                distanceAbs = Math.abs(distance);

            switch (random(0, 2)){
                case 0:
                    if (distance > 0){
                        if (random(0, distanceAbs) < distanceAbs)
                        {
                            self.action(self);
                            return;
                        }
                    }
                    self.rightHand.accelerate(new Physics.vector(SPEED_DELTA, 0));
                    break;
                case 1:
                    if (distance < 0){
                        if (random(0, distanceAbs) < distanceAbs)
                        {
                            self.action(self);
                            return;
                        }
                    }
                    self.leftHand.accelerate(new Physics.vector(-SPEED_DELTA, 0));
                    break;

            }
        },

        init: function(world){
            _world = world;
            var goalkeeperLayer = world._renderer.addLayer('goalkeeper', undefined, { manual: true, zIndex: 1 });

            head$ = loader.getFile('head').image$;
            leftHand$ = loader.getFile('leftHand').image$;
            rightHand$ = loader.getFile('rightHand').image$;

            var self = this;
            world.on('render', function (data) {
                tick++;
                if (tick === 10){
                    tick = 0;
                    balance();
                }
                if (_goalkeeper == undefined)
                    return;

                var pos = world.getPosRel(_goalkeeper.head.state.pos),
                    leftPos = world.getPosRel(_goalkeeper.leftHand.state.pos),
                    rightPos = world.getPosRel(_goalkeeper.rightHand.state.pos),
                    ctx = goalkeeperLayer.ctx;

                if (_isNeedToReset)
                {
                    ctx.clearRect(0, 0, goalkeeperLayer.el.width, goalkeeperLayer.el.height);
                    _isNeedToReset = false;
                }
                else
                    ctx.clearRect(leftPos.x - 100, leftPos.y - 150, rightPos.x + 100, rightPos.y + 150);

                ctx.strokeStyle = '#000000';
                ctx.beginPath();
                ctx.moveTo(pos.x - SIZE + 10, pos.y - 1);
                ctx.lineTo(leftPos.x + 10, leftPos.y - 3);
                ctx.lineWidth = 8;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(pos.x + SIZE - 10, pos.y - 1);
                ctx.lineTo(rightPos.x - 10, rightPos.y - 3);
                ctx.lineWidth = 8;
                ctx.stroke();
            });
        }
    };

});