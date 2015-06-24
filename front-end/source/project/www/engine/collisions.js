define(function () {

    function is(c, nameA, nameB) {
        return (c.bodyA.name === nameA && c.bodyB.name === nameB) ||
            (c.bodyA.name === nameB && c.bodyB.name === nameA);
    }

    return {
        init: function (world) {
            world.on('collisions:detected', function (data) {
                if (world.state !== 'strike')
                    return;

                var c;
                for (var i = 0, l = data.collisions.length; i < l; i++) {
                    c = data.collisions[ i ];

                    if (is(c, 'ball', 'crossbar') === true)
                        world.emit('ball:crossbar');
                    else if (is(c, 'ball', 'hand') === true) {
                        world.emit('ball:hand');
                    }
                }
            });
        }
    };

});