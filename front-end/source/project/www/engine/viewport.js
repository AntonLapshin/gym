define(['physics', 'jquery', 'engine/friction', 'engine/twist'],
    function (Physics, $, friction) {

        return {
            init: function (width, height) {
                return $.Deferred(function(defer){
                    Physics({ timestep: 2 }, function (world) {
                        var renderer = Physics.renderer('canvas', {
                                el: 'viewport',
                                width: width,
                                height: height,
                                meta: false
                            }),
                            main = renderer.layer('main');
                        world.add(renderer);

                        main.options.offset = new Physics.vector(0, 0);
                        renderer.addLayer('top', undefined, { manual: true, zIndex: 1000 });

                        world.add([
                            Physics.behavior('friction'),
                            Physics.behavior('twist'),
                            Physics.behavior('body-impulse-response'),
                            Physics.behavior('body-collision-detection'),
                            Physics.behavior('sweep-prune'),
                        ]);

                        world.on('step', function (data) {
                            world.render();
                        });

                        Physics.util.ticker.on(function (time) {
                            world.step(time);
                        });

                        // ---------- Extend World ----------
                        world.getTopLayer = function(){
                            return renderer.layer('top');
                        };
                        world.getOffset = function () {
                            return main.options.offset;
                        };
                        world.getPosRel = function (posAbs) {
                            return (new Physics.vector(posAbs)).vadd(world.getOffset());
                        };
                        world.getPosAbs = function (posRel) {
                            return (new Physics.vector(posRel)).vsub(world.getOffset());
                        };
                        world.getVectorLength = function (posRel) {
                            return (new Physics.vector(posRel)).vsub(world.getOffset());
                        };
                        world.getLength = function(vector){
                            var x = vector.x,
                                y = vector.y;
                            return Math.sqrt(x*x + y*y);
                        };
                        world.clearLayer = function(layerName){
                            var layer = world._renderer.layer(layerName),
                                ctx = layer.ctx;
                            ctx.clearRect(0, 0, width, height);
                        };
                        // ---------- Extend World ----------

                        defer.resolve(world);
                    });
                });
            }
        };


    });

