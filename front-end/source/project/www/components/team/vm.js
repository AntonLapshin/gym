define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function (ko, html, component) {

    function ViewModel() {
        this.team = ko.observable();
        this.position = ko.observable('left');

        this.show = function (params) {
            this.set(params);
            this.isVisible(true);
        };

        this.set = function(params){
            if (params && params.team){
                this.team(typeof params.team === 'function' ? params.team() : params.team);
            }
            this.position(params && params.position ? params.position : 'left');
        };

        this.test = function () {
            var self = this;
            require(['model/teams'], function (teams) {
                self.show({ team: teams[0] });
            });
        };
    }

    return component.add(ViewModel, html, 'team');
});