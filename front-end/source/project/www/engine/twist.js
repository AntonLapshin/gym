define(['physics'], function (Physics) {

    function getLength(vector) {
        var x = vector.x,
            y = vector.y;
        return Math.sqrt(x * x + y * y);
    }

    var MIN_SPEED = 0.00001;

    Physics.behavior('twist', function (parent) {

        var defaults = {
            koeff: 0.1
        };

        return {

            init: function (options) {

                parent.init.call(this);
                this.options.defaults(defaults);
                this.options(options);

                this._koeff = this.options.koeff;
            },

            behave: function (data) {
                var bodies = data.bodies;
                var self = this;

                bodies.forEach(function (body) {
                    if (body.name !== 'ball' || !body.strikeVector)
                        return;

                    var angularVel = body.state.angular.vel,
                        twistVector = new Physics.vector(angularVel * self._koeff, 0);

                    body.state.vel.vadd(twistVector);

//                    if (!body.twistVector) {
//                        var strikeVector = body.strikeVector,
//                            angularVel = body.state.angular.vel,
//                            strengthStrikeVector = getLength(strikeVector),
//                            perpVector = strikeVector.clone().perp(angularVel < 0);
//
//                        perpVector.normalize().mult(self._koeff * Math.abs(angularVel)).y = 0;
//                        body.twistVector = perpVector;
//                    }
//                    var angularVel = body.state.angular.vel,
//                        vel = body.state.vel,
//                        velStrength = getLength(vel);
//
//                    body.state.vel.vadd(body.twistVector);
                });
            }
        };
    });

});