define(['jquery'], function ($) {
    $('body').on('DOMNodeInserted', '[data-toggle="tooltip"]', function (e) {
        window.setTimeout(function () {
            $(e.target).tooltip();
        }, 0);
    });
});