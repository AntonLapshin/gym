define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'model/game',
    'model/player',
    'c/private/vm',
    'c/menu/vm',
    'c/man/vm',
    'c/job/vm',
    'c/gyms/vm',
    'c/workout/vm',
    'c/top/vm',
    'c/achievements/vm'
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
            }
            else {
                it('main').hide();
            }
        });
    }

    function ViewModel() {
        this.init = function (player) {
            private('main').show().init(player);
            menu('main').show().init()
                .progress(function(index){
                    if (index === 0)
                        man('main').update(game.player);
                    openItem(menuItems[index]);
                });
            man('main').init(player);
            gyms('main').init();
            achievements('main').init();
            top('main').show().init().toAllTop();
            openItem(man);

            c.on('gyms.select', function(id){
                gyms('main').hide();
                workout('main').show().init(id);
            });

            c.on('player.click', function(id){
                if (game.player._id !== id){
                    var player = new Player(id);
                    player.load().then(function(){
                        man('main').update(player);
                        openItem(man);
                        menu('main').selectByIndex(-1);
                    });
                }
                else {
                    menu('main').selectByIndex(0);
                }
            });
        };

        this.test = function () {
            this.show().init(game.player);
        };

        c.on('home', function(){
            menu('main').selectByIndex(0);
        });
    }

    return c.add(ViewModel, html, 'main');
});