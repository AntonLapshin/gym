define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'model/game',
    'c/private/vm',
    'c/menu/vm',
    'c/man/vm',
    'c/job/vm',
    'c/gyms/vm'
], function (ko, $, html, c, game, private, menu, man, job, gyms) {

    var menuItems = [
        man, job, gyms
    ];

    function openItem(item){
        $.each(menuItems, function(i, it){
            if (it === item){
                it('main').show();
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
                    switch(index){
                        case 0: openItem(man); break;
                        case 1: openItem(job); break;
                        case 2: openItem(gyms); break;
                    }
                });
            man('main').init(player);
            openItem(man);
        };

        this.test = function () {
            this.show().init(game.player);
        };

        c.on('home', function(){
            openItem(man);
            menu('main').selectByIndex(0);
        });
    }

    return c.add(ViewModel, html, 'main');
});