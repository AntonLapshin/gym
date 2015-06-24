define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/team/vm',
    'social/social',
    'plugins/localization'
], function (ko, html, component, team, social, strings) {

    var _viewModel = {
        place: ko.observable(),
        goals: ko.observable(),
        team: ko.observable(null),
        score: ko.observable(),
        title: strings.titleResults,
        txtPlace: strings.txtPlace,
        txtGoals: strings.goals,
        linkGroup: strings.linkGroup,
        linkInvite: strings.linkInvite,
        communityHref: social.getCommunityHref(),

        show: function (score, place, team, goals) {
            this.score(score);
            this.place(place);
            this.team(team);
            this.goals(goals);
            this.isVisible(true);
        },

        invite: function () {
            social.invite();
        },

        test: function () {
            var self = this;

            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            require(['plugins/options'], function (options) {
                self.show(1000, 2, options.teams[2], 12);
            });
        }
    };

    return component.add(_viewModel, html, 'result');
});