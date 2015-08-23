define([
    'ko',
    'text!./view.html',
    'c'
], function (ko, html, c) {

    var _player,
        _render,
        _character$;

    function ViewModel() {
        var self = this;

        this.init = function(){
            c.on('player.updated', function (player) {
                self.set(player);
            });
            return self;
        };

        this.set = function(player){
            _player = player;

            function render(){
                _character$.html('');
                var shorts$ = $('<img />')
                    .addClass('img-layer')
                    .attr('src', c.format('components/character/img/{0}_shorts.png', _player.public.level()));
                _character$.append(shorts$);
            }

            if (self.elem$)
                render();
            else
                _render = render;

            return self;
        };

        this.onLoad = function(){
            _character$ = self.elem$.find('.character');
            if (_render)
                _render();
            //self.elem$.html('');
            //var shorts$ = $('<img />')
            //    .attr('src', c.format('components/character/img/{0}_shorts.png', _player.public.level()))
        };

        this.test = function () {
            require(['model/game'], function (game) {
                self.init().set(game.player).show();
            });
        };
    }

    return c.add(ViewModel, html, 'character');
});