define(['jquery', 'plugins/loader', 'howler'], function ($, loader) {

    var VOLUME = 0.5;

    return {

        play: function (name) {
            var file = loader.getFile(name);
            if (!(file && file.audio))
                return;

            file.audio.volume = VOLUME;
            file.audio.play();
        },

        isMuted: function(){
            return Howler._muted;
        },

        stop: function(){
            var files = loader.getAllFiles();
            files.forEach(function(file){
                if (file.audio)
                    file.audio.stop();
            })
        },

        mute: function(){
            Howler.mute();
        },

        unmute: function(){
            Howler.unmute();
        }
    };
});