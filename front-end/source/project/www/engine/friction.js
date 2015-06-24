define(['physics'], function (Physics) {

    function getLength(vector){
        var x = vector.x,
            y = vector.y;
        return Math.sqrt(x*x + y*y);
    }

    var MIN_SPEED = 0.00001;

    Physics.behavior('friction', function (parent) {

        var defaults = {
            koeff: 0.001,
            angKoeff: 0.002
        };

        return {

            // extended
            init: function (options) {

                parent.init.call(this);
                this.options.defaults(defaults);
                this.options(options);

                // extend options
                this._koeff = this.options.koeff;
                this._angKoeff = this.options.angKoeff;
            },

            // extended
            behave: function (data) {

                var bodies = this.getTargets();

                for (var i = 0, l = bodies.length; i < l; ++i) {
                    var body = bodies[ i ];
                    var kVelocity = body.class === 'goalkeeper' ? this._koeff * 10 : this._koeff;
                    var vector = body.state.vel.clone().mult(kVelocity);
                    if (getLength(vector) < MIN_SPEED)
                        vector = body.state.vel.clone();
                    body.state.vel.vsub(vector);

                    var angVel = body.state.angular.vel;
                    var da;

                    var kAngular = body.class === 'goalkeeper' ? this._angKoeff * 10 : this._angKoeff;
                    if (angVel > 0){
                        da = kAngular * angVel;
                        angVel = angVel - da;
                        if (angVel < 0) angVel = 0;
                    }
                    else if (angVel < 0){
                        da = kAngular * angVel;
                        angVel = angVel - da;
                        if (angVel > 0) angVel = 0;
                    }
                    body.state.angular.vel = angVel;
                }
            }
        };
    });

});