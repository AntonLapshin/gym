define(['model/resources', 'lodash', 'howler'], function (resources) {

    var TIMEOUT = 2000;

    function loadImage(image) {
        return $.Deferred(function (defer) {
            image.image$ = $('<img />')
                .on('load', function () {
                    defer.resolve();
                    if (!image.target) return;
                    image.target.forEach(function (target) {
                        function setProperty() {
                            var o$ = $(target);
                            if (o$.length === 0) {
                                setTimeout(setProperty, 20);
                                return;
                            }
                            if (image.name.indexOf('background') !== -1)
                                o$.css('background-image', 'url(' + image.src + ')');
                            else
                                o$.attr('src', image.src);
                        }

                        setProperty();
                    });
                })
                .attr('src', require.toUrl(image.src));

            if (!image.required)
                setTimeout(defer.resolve, TIMEOUT);
        });
    }

    function loadSound(file) {
        return $.Deferred(function (defer) {
            file.audio = new Howl({
                urls: [require.toUrl(file.src)],
                loop: file.loop,
                onload: function() {
                    defer.resolve()
                }
//                onloaderror: function(e){
//                    console.error(e);
//                    defer.reject(e);
//                }
            });

            if (!file.required)
                setTimeout(defer.resolve, TIMEOUT);
        });
    }

    function getLoadMethod(src) {
        var arr = src.split('.'),
            ext = arr[arr.length - 1];

        return ext === 'mp3' ? loadSound : loadImage;
    }

    return {
        resources: resources,

        getFile: function (name) {
            for (var stage in resources) {
                if (!resources.hasOwnProperty(stage))continue;
                var file = _.where(resources[stage], { 'name': name })[0];
                if (file && file.loaded)
                    return file;
            }
            throw 'Resource is not found: ' + name;
        },

        getAllFiles: function(){
            var files = [];
            for (var stage in resources) {
                if (!resources.hasOwnProperty(stage))continue;
                files = files.concat(resources[stage]);
            }
            return files;
        },

        load: function (files, onPercentChanged) {
            var count = files.length,
                defers = [],
                i = 0;

            files.forEach(function (file) {
                var defer = getLoadMethod(file.src)(file);
                defers.push(defer);
                defer.then(function () {
                    file.loaded = true;
                    if (onPercentChanged)
                        onPercentChanged((Math.floor((++i / count) * 100)));
                })
            });
            return $.when.apply($, defers);
        }
    }
});
