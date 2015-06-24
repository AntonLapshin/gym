define(['jquery', 'physics'],
    function ($, Physics) {

    var ARROW_SHAPE = [
            [ -20, -25 ],
            [ -20, 25 ],
            [ 10, 0 ]
        ],
        ARROW_WIDTH = 24,
        ARROW_LENGTH_MIN = 20,
        ARROW_LENGTH_MAX = 200,
        OPACITY = 0.4;

    function getLength(vector){
        var x = vector.x,
            y = vector.y;
        return Math.sqrt(x*x + y*y);
    }

    function drawFilledPolygon(ctx, shape) {
        ctx.beginPath();
        ctx.moveTo(shape[0][0], shape[0][1]);

        for (p in shape)
            if (p > 0) ctx.lineTo(shape[p][0], shape[p][1]);

        ctx.lineTo(shape[0][0], shape[0][1]);
        ctx.fill();
    }

    function translateShape(shape, x, y) {
        var rv = [];
        for (p in shape)
            rv.push([ shape[p][0] + x, shape[p][1] + y ]);
        return rv;
    }

    function rotateShape(shape, ang) {
        var rv = [];
        for (p in shape)
            rv.push(rotatePoint(ang, shape[p][0], shape[p][1]));
        return rv;
    }

    function rotatePoint(ang, x, y) {
        return [
            (x * Math.cos(ang)) - (y * Math.sin(ang)),
            (x * Math.sin(ang)) + (y * Math.cos(ang))
        ];
    }

    function drawLineArrow(ctx, start, end, reducedEnd) {
        ctx.strokeStyle = '#000000';
        ctx.globalAlpha = OPACITY;

        if (reducedEnd != null) {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(reducedEnd.x, reducedEnd.y);
            ctx.lineWidth = ARROW_WIDTH;
            ctx.stroke();
        }

        var ang = Math.atan2(end.y - start.y, end.x - start.x);
        drawFilledPolygon(ctx, translateShape(rotateShape(ARROW_SHAPE, ang), end.x, end.y));
        ctx.globalAlpha = 1;
    }

    function getElementOffset(el) {
        var curleft = 0,
            curtop = 0;

        if (el.offsetParent) {
            do {
                curleft += el.offsetLeft;
                curtop += el.offsetTop;
            } while (el = el.offsetParent);
        }

        return { left: curleft, top: curtop };
    }

    function getCoords(e) {
        var offset = getElementOffset(e.target),
            obj = ( e.changedTouches && e.changedTouches[0] ) || e,
            x = obj.pageX - offset.left,
            y = obj.pageY - offset.top;

        return { x: x, y: y };
    }

    function getStrikeVector(directionVector, strength){
        return directionVector.clone().normalize().mult(strength);
    }

    return {

        strikeVector: null,

        drawPsychicArrow: function(world, vector){
            var arrowLayer = world._renderer.layer('arrow');

            var startPosAbs = world.isAttack ? world.goalkeeper.head.state.pos : world.ball.state.pos,
                endPosAbs;

            if (world.isAttack){
                endPosAbs = world.ball.state.pos.clone().vadd(vector.clone().normalize().mult(650))
            }
            else{
                endPosAbs = world.ball.state.pos.clone().vadd(vector.clone().normalize().mult(ARROW_LENGTH_MAX))
            }

            var startPosRel = world.getPosRel(startPosAbs),
                endPosRel = world.getPosRel(endPosAbs),
                directionVector = endPosAbs.clone().vsub(startPosAbs),
                diffVector = directionVector.clone().normalize().mult(ARROW_LENGTH_MIN),
                reducedEndPosAbs = endPosAbs.clone().vsub(diffVector),
                reducedEndPosRel = world.getPosRel(reducedEndPosAbs);

            drawLineArrow(arrowLayer.ctx, startPosRel, endPosRel, reducedEndPosRel);
        },

        init: function (world) {

            var arrowLayer = world._renderer.addLayer('arrow', undefined, { manual: true, zIndex: 10 }),
                topLayer = world.getTopLayer(),
                startPosAbs = null,
                endPosAbs = null,
                self = this,
                clean = false,
                isGrab = false;

            var grab = function (e) {
                var ballRadius = world.ball.geometry.radius,
                    headRadius = world.goalkeeper.head.geometry.radius;

                world.ball.geometry.radius = 100;
                world.goalkeeper.head.geometry.radius = 100;

                var posAbs = world.getPosAbs(new Physics.vector(getCoords(e))),
                    body = world.findOne({ $at: posAbs });

                world.ball.geometry.radius = ballRadius;
                world.goalkeeper.head.geometry.radius = headRadius;

                if (!body) return;

                if (world.isAttack && body == world.ball){
                    startPosAbs = world.ball.state.pos.clone();
                    isGrab = true;
                }
                else if(!world.isAttack && body === world.goalkeeper.head){
                    startPosAbs = world.goalkeeper.head.state.pos.clone();
                    isGrab = true;
                }
            };

            var move = function (e) {
                if (isGrab){
                    e.preventDefault();
                    endPosAbs = world.getPosAbs(new Physics.vector(getCoords(e)));
                }
            };

            var release = function (e) {
                if (isGrab === true && world.state === 'start')
                {
                    isGrab = false;
                    world.emit('arrow:ready');
                }
            };

            topLayer.el.addEventListener('mousedown', grab);
            topLayer.el.addEventListener('touchstart', grab);
            topLayer.el.addEventListener('mousemove', move);
            topLayer.el.addEventListener('touchmove', move);
            topLayer.el.addEventListener('mouseup', release);
            topLayer.el.addEventListener('touchend', release);

            world.on('render', function (data) {
                if (world.state !== 'start')
                {
                    if (clean === false){
                        arrowLayer.ctx.clearRect(0, 0, arrowLayer.el.width, arrowLayer.el.height);
                        clean = true;
                        startPosAbs = null;
                        endPosAbs = null;
                        isGrab = false;
                    }
                    return;
                }

                if (startPosAbs === null || endPosAbs === null || world.state !== 'start')
                    return;

                var directionVector = endPosAbs.clone().vsub(startPosAbs),
                    reducedEndPosAbs = null,
                    reducedEndPosRel = null,
                    length = getLength(directionVector);

                if (length > ARROW_LENGTH_MAX){
                    var excess = length - ARROW_LENGTH_MAX;
                    var excessVector = directionVector.clone().normalize().mult(excess);
                    endPosAbs.vsub(excessVector);
                    self.strikeVector = getStrikeVector(directionVector, ARROW_LENGTH_MAX);
                }
                else
                    self.strikeVector = getStrikeVector(directionVector, length);

                if (length > ARROW_LENGTH_MIN) {
                    var diffVector = directionVector.clone().normalize().mult(ARROW_LENGTH_MIN);
                    reducedEndPosAbs = endPosAbs.clone().vsub(diffVector);
                }

                var startPosRel = world.getPosRel(startPosAbs),
                    endPosRel = world.getPosRel(endPosAbs);

                if (reducedEndPosAbs)
                    reducedEndPosRel = world.getPosRel(reducedEndPosAbs);

                arrowLayer.ctx.clearRect(startPosRel.x - 250, startPosRel.y - 250, endPosRel.x + 250, endPosRel.y + 250);

                drawLineArrow(arrowLayer.ctx, startPosRel, endPosRel, reducedEndPosRel);
                if (clean === true)
                    clean = false
            });
        }
    };

});