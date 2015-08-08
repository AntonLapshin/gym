window.cfg = {
    debug: true,
    payments: true,
    publish: true,
    server: "http://localhost:8080/",
    language: "ru"
};

requirejs.config({
    shim: {
        'fb': { exports: 'FB' },
        'bootstrap': { deps: ['jquery']},
        'bootbox': { deps: ['bootstrap']}
    },
    paths: {
        tween: 'lib/tween',
        text: 'lib/text',
        physics: '//cdn.jsdelivr.net/physicsjs/0.6.0/physicsjs.full.min',
        howler: '//cdnjs.cloudflare.com/ajax/libs/howler/1.1.17/howler.min',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
        ko: 'lib/ko.debug',
        //knockout: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min',
        //ko: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min',
        lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
        vk: '//vk.com/js/api/xd_connection',
        fb: '//connect.facebook.net/en_US/all',
        bootstrap: 'bootstrap/js/bootstrap.min',
        slider: 'lib/bootstrap-slider.min',
        bootbox: '//cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.3.0/bootbox.min',
        toastr: 'lib/toastr.min',
        //kob: 'lib/knockout-bootstrap.min',
        c: 'components/'
    }
});

require([
    'ko',
    'jquery',
    'text',
    'plugins/component',
    'bootstrap',
    'social/social',
    'social/demo',
    'server/server',
    'server/demo',
    'model/game',
    'plugins/dynamic-tooltips',
    'plugins/prevent-selection'
], function (ko,
             $,
             text,
             component,
             bootstrap,
             social,
             socialInstance,
             server,
             serverInstance,
             game
    ) {
    $.when.apply($, [social.init(socialInstance), server.init(serverInstance)])
        .then(function () {
            return game.init();
        })
        .then(function(){
            var search = window.location.search,
                testComponentName = search.length > 0 ? search.substring(1) : null;
            if (window.cfg.debug === true && testComponentName) {
                require(['c/' + testComponentName + '/vm'], function (component) {
                    window.stopSpinner();
                    ko.applyBindings({});
                    component().test();
                });
            }
            else {
                require(['lifecycle']);
            }
        })
});

