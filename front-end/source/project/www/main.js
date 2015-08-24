window.cfg = {
    debug: true,
    payments: true,
    publish: true,
    server: "http://94.251.114.123:8080/",
    language: "ru",
    updatePeriod: 100
};

requirejs.config({
    shim: {
        'fb': { exports: 'FB' },
        'bootstrap': { deps: ['jquery'] },
        'bootbox': { deps: ['bootstrap'] }
    },
    paths: {
        ko: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug',
        //ko: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min',
        howler: '//cdnjs.cloudflare.com/ajax/libs/howler/1.1.17/howler.min',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min',
        bootbox: '//cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.3.0/bootbox.min',
        toastr: '//cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.1/toastr.min',
        slider: '//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/4.14.4/bootstrap-slider.min',
        vk: '//vk.com/js/api/xd_connection',
        fb: '//connect.facebook.net/en_US/all',
        text: 'lib/ko/text',
        c: 'plugins/component',
        cs: 'components/'
    }
});

require([
    'ko',
    'jquery',
    'text',
    'bootstrap',
    'social/social',
    'social/demo',
    'server/server',
    'server/heroku',
    'model/game',
    'plugins/dynamic-tooltips',
    'plugins/prevent-selection',
    'plugins/ko-hack'
], function (ko,
             $,
             text,
             bootstrap,
             social,
             socialInstance,
             server,
             serverInstance,
             game
    ) {
    var playerId = 5653333;
    var authKey = 123;
    $.when.apply($, [social.init(socialInstance), server.init(serverInstance, playerId, authKey)])
        .then(function () {
            return game.init();
        }, function(err){
            window.stopSpinner();
            game.error(err);
        })
        .then(function(){
            var search = window.location.search,
                testComponentName = search.length > 0 ? search.substring(1) : null;
            if (window.cfg.debug === true && testComponentName) {
                require(['cs/' + testComponentName + '/vm'], function (component) {
                    window.stopSpinner();
                    ko.applyBindings({});
                    component().test();
                });
            }
            else {
                require(['cs/main/vm'], function(main){
                    window.stopSpinner();
                    ko.applyBindings({});
                    main().test();
                });
            }
        })
});

