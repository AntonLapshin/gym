define(['jquery', 'physics'], function ($, Physics) {

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

    return {

        init: function(world, width, height, sizeX, sizeY){

            this.width = width;
            this.height = height;
            this.minX = width / 2;
            this.minY = height / 2;
            this.maxX = sizeX - width;
            this.maxY = sizeY - height;
            this.middle = { x: width / 2, y: height / 2 };

            var topLayer = world.getTopLayer(),
                self = this;

            function getTargetVector(pos){
                var x = pos.x,
                    y = pos.y,
                    newX = 0,
                    newY = 0;

                if (x < self.minX)
                    newX = self.minX;
                else if (x > self.maxX)
                    newX = self.maxX;
                else
                    newX = x;

                if (y < self.minY)
                    newY = self.minY;
                else if (y > self.maxY)
                    newY = self.maxY;
                else
                    newY = y;

                return Physics.vector(newX, newY);
            }

            world.on('step', function(){
                if (self.mode === 'follow')
                {
                    world.getOffset().clone( self.middle ).vsub( getTargetVector(self.followObject.state.pos) );
                }
                else if (self.mode === 'point')
                {
                    world.getOffset().clone( self.middle ).vsub( getTargetVector(self.targetPoint) );
                }
            });

            var isGrab = false;
            var startPosAbs = null;

            var grab = function (e) {
                var posAbs = world.getPosAbs(new Physics.vector(getCoords(e))),
                    body = world.findOne({ $at: posAbs });

                if (!body) {
                    isGrab = true;
                    startPosAbs = posAbs;
                    self.mode = 'grab';
                }
            };

            var move = function (e) {
                if (isGrab){
                    var posAbs = world.getPosAbs(new Physics.vector(getCoords(e)));
                    var diffVector = posAbs.clone().vsub(startPosAbs);
                    var offset = world.getOffset();
                    var cameraPos = new Physics.vector(Math.abs(offset.x) + self.minX, Math.abs(offset.y) + self.minY);
                    var resultPos = cameraPos.vsub(diffVector);
                    world.getOffset().clone( self.middle ).vsub( getTargetVector(resultPos) );
                }
            };

            var release = function (e) {
                isGrab = false;
                startPosAbs = null;
            };

            topLayer.el.addEventListener('mousedown', grab);
            topLayer.el.addEventListener('touchstart', grab);
            topLayer.el.addEventListener('mousemove', move);
            topLayer.el.addEventListener('touchmove', move);
            topLayer.el.addEventListener('mouseup', release);
            topLayer.el.addEventListener('touchend', release);
        },

        followObject: null,
        targetPoint: null,
        mode: null,

        follow: function(body){
            this.targetPoint = null;
            this.followObject = body;
            this.mode = 'follow';
        },

        toPoint: function(point){
            this.followObject = null;
            this.targetPoint = new Physics.vector(point);
            this.mode = 'point';
        }

    };

});