define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'plugins/audio'
], function (ko, html, component, audio) {

    var _viewModel = {
        isMuted: ko.observable(false),

        show: function () {
            this.isVisible(true);
        },

        unmute: function () {
            audio.unmute();
            this.isMuted(false);
        },

        mute: function () {
            audio.mute();
            this.isMuted(true);
        },

        press: function () {
            if (audio.isMuted())
                this.unmute();
            else
                this.mute();
        },

        test: function () {
            var self = this;
            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.ENGINE)
                    .then(function () {
                        self.show();
                        audio.play('stadium');
                    })
            });
        }
    };

    return component.add(_viewModel, html, 'sound');
});