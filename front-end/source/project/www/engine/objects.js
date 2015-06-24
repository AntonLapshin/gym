define(['jquery', 'physics', 'engine/points'], function ($, Physics, Points) {

    var restitution = 0.1,
        gateLength = 560,
        size = 7,
        cof = 0.1,
        hidden = true;

    return {
        init: function(world){

            var crossbar1 = Physics.body('circle', {
                x: Points.LeftCrossbar.x,
                y: Points.LeftCrossbar.y,
                radius: size,
                cof: cof,
                restitution: restitution,
                hidden: hidden
            });

            var crossbar2 = Physics.body('circle', {
                x: Points.RightCrossbar.x,
                y: Points.RightCrossbar.y,
                radius: size,
                cof: cof,
                restitution: restitution,
                hidden: hidden
            });

            var gate1 = Physics.body('rectangle', {
                x: Points.LeftGate.x,
                y: Points.LeftGate.y,
                width: 3,
                height: 135,
                cof: cof,
                restitution: restitution,
                hidden: hidden
            });

            var gate2 = Physics.body('rectangle', {
                x: Points.RightGate.x,
                y: Points.RightGate.y,
                width: 3,
                height: 135,
                cof: cof,
                restitution: restitution,
                hidden: hidden
            });

            var gate3 = Physics.body('rectangle', {
                x: Points.TopGate.x,
                y: Points.TopGate.y,
                width: 559,
                height: 3,
                cof: cof,
                restitution: restitution,
                hidden: hidden
            });

            crossbar1.treatment = 'static';
            crossbar2.treatment = 'static';
            gate1.treatment = 'static';
            gate2.treatment = 'static';
            gate3.treatment = 'static';

            crossbar1.name = crossbar2.name = 'crossbar';

            world.add(crossbar1);
            world.add(crossbar2);
            world.add(gate1);
            world.add(gate2);
            world.add(gate3);

            world.on('step', function(){
                if (world.state !== 'strike' && world.state !== 'hand' && world.state !== 'crossbar')
                    return;

                var ball = world.ball;
                if (ball.state.vel.y > 0 && ball.state.pos.y > crossbar1.state.pos.y + 200)
                    world.emit('ball:stop');
                else if (ball.state.vel.x === 0 && ball.state.vel.y === 0 ||
                    ball.state.pos.y < 0)
                    world.emit('ball:stop');
                else{
                    var pos = ball.state.pos;
                    if (pos.x > crossbar1.state.pos.x &&
                        pos.x < crossbar2.state.pos.x &&
                        pos.y < crossbar1.state.pos.y){
                        world.emit('goal');
                    }
                }
            });
        }
    };

});