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
            return $.Deferred(function(defer){
                $.ajax({
                    url: generateUrl(route, params),
                    type: 'GET',
                    dataType: 'json',
                    timeout: TIMEOUT
                }).then(function(answer){
                    answer = JSON.parse(answer);

                    if (window.cfg.debug) {
                        var url = answer.url.split('&');
                        url.pop();
                        url.pop();
                        answer.url = url.join('&');
                        console.log(answer);
                    }

                    if (answer.error) {
                        defer.reject(answer.error);
                        return;
                    }

                    defer.resolve(answer.data);
                });
            });
        }
    };
});