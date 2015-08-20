define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    var _k = [
        { level: 18, k: 1.66 },
        { level: 40, k: 1.59 },
        { level: 67, k: 1.85 }
    ];

    var sdiffk = 1;
    var fdiffk = 1.5;

    function getWeight(level){
        var levelRest = level;
        var weight = 0;
        $.each(_k, function(i, item){
            if (levelRest >= item.level){
                weight += (item.level * item.k);
            }else {
                weight += (levelRest * item.k);
                return false;
            }
            levelRest -= item.level;
        });

        return 45 + weight;
    }

    function getWeightDiff(body){
        var sdiff = 0;
        var fdiff = 0;
        var qty = body.length;

        $.each(body, function(i, m){
            sdiff += m.stress() / qty;
            fdiff += m.frazzle() / qty;
        });

        return sdiff * sdiffk - fdiff * fdiffk;
    }

    function ViewModel() {
        var self = this;

        this.weight = ko.observable();

        this.init = function(){
            c.on('player.updated', function (player) {
                self.set(player);
            });
            return self;
        };

        this.set = function(player){
            var weight = getWeight(player.public.level()) + getWeightDiff(player.private.body);
            this.weight(weight);
            return self;
        };

        this.test = function () {
            require(['model/game'], function (game) {
                self.init().set(game.player).show();
            });
        };
    }

    return c.add(ViewModel, html, 'weigher');
});