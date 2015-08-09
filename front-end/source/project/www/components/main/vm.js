define([
    'ko',
    'jquery',
    'text!./view.html',
    'c',
    'model/game',
    'model/player',
    'cs/private/vm',
    'cs/menu/vm',
    'cs/man/vm',
    'cs/job/vm',
    'cs/gyms/vm',
    'cs/workout/vm',
    'cs/top/vm',
    'cs/achievements/vm'
], function (ko, $, html, c, game, Player, private, menu, man, job, gyms, workout, top, achievements) {

    var menuItems = [
        man, job, gyms, achievements, workout, workout
    ];

    function openItem(item){
        $.each(menuItems, function(i, it){
            if (it === item){
                it('main').show();
                if(it('main').start)
                    it('main').start();
                if(it('main').update)
                    it('main').update();
            }
            else {
                it('main').hide();
            }
        });
    }

    function ViewModel() {
        var self = this;

        this.init = function(){
            private('main').init().show();
            menu('main').init().show();
            man('main').init();
            gyms('main').init();
            achievements('main').init();
            top('main').init().show();
            workout('main').init();

            c.on('gyms.select', function(id){
                gyms('main').hide();
                workout('main').set(id).show();
            });

            c.on('menu.select', function(index){
                if (index === 0)
                    man('main').set(game.player);
                openItem(menuItems[index]);
            });

            c.on('player.click', function(id){
                if (game.player._id !== id){
                    var player = new Player(id);
                    player.load().then(function(){
                        man('main').set(player);
                        openItem(man);
                        menu('main').selectByIndex(-1);
                    });
                }
                else {
                    menu('main').selectByIndex(0);
                }
            });

            return self;
        };

        this.set = function (player) {
            private('main').set(player);
            man('main').set(player);
            top('main').toAllTop();
            openItem(man);

            return self;
        };

        this.test = function () {
            this.init().set(game.player).show();
        };

        c.on('home', function(){
            menu('main').selectByIndex(0);
        });
    }

    return c.add(ViewModel, html, 'main');
});