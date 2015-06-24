define(['tween'], function (tween) {

    return {
        init: function (world) {
            function bulletTime(active) {
                var warp = active === false ? 1 : 0.06,
                    tween;

                tween = new TWEEN.Tween({ warp: world.warp() })
                    .to({ warp: warp }, 600)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function () {
                        // set the world warp on every tween step
                        world.warp(this.warp);
                    })
                    .start();
            }

            world.on('step', function (data) {
                TWEEN.update();
            });

            world.on('arrow:ready', function () {
                setTimeout(function () {
                    bulletTime(true);
                    setTimeout(function () {
                        bulletTime(false);
                    }, 3000)
                }, 70);
            });
        }
    };

});