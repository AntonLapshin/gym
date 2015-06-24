define(['jquery', 'physics', 'engine/points', 'plugins/loader'], function ($, Physics, Points, loader) {

    var _isDraw = false;

    return {
        xPrev: -1,
        yPrev: -1,
        init: function(world){
            var renderer = world._renderer,
                backgroundLayer = renderer.addLayer('background', undefined, { manual: true }),
                gateLayer = renderer.addLayer('gate', undefined, { manual: true, zIndex: 5 });

            var background$ = loader.getFile('field').image$,
                gate$ = loader.getFile('gate').image$;

            world.on('render', function( data ){
                if (_isDraw)return;
                backgroundLayer.ctx.drawImage(background$[0], 0, 0);
                gateLayer.ctx.drawImage(gate$[0], Points.GateOffset.x, Points.GateOffset.y);
                _isDraw = true;
            });
        }
    };

});