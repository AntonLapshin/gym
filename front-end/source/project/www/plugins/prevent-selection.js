define(['jquery'], function ($) {
    $('*').on('selectstart', function () {
        return false;
    });
});