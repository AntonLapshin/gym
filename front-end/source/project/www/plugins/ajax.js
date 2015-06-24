define(['jquery'], function ($) {

    var SERVER_NAME = window.cfg.server,
        URL_END = "callback=?",
        TIMEOUT = 50000;

    function generateUrl(route, params) {
        var url = SERVER_NAME + route + "?";

        if (params != null) {
            for (var name in params) {
                url = url + name + "=" + params[name] + "&";
            }
        }

        url += URL_END;
        return url;
    }

    return {
        callAjax: function (route, params) {
            return $.ajax({
                url: generateUrl(route, params),
                type: 'GET',
                dataType: 'json',
                timeout: TIMEOUT
            });
        }
    };
});