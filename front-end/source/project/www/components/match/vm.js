define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/team/vm',
    'plugins/localization',
    'model/teams'
], function (ko, html, component, team, strings, teams) {

    function random(min, max) {
        return (Math.random() * (max - min) + min) | 0
    }

    var _defer;

    var _viewModel = {
        isBallotVisible: ko.observable(true),
        isBeginVisible: ko.observable(false),

        teamA: ko.observable(-1),
        teamB: ko.observable(-1),
        firstTeam: ko.observable(-1),
        teams: teams,
        firstTurn: strings.firstTurn,
        drawLot: strings.drawLot,
        btnStart: strings.btnStart,

        show: function (teamA, teamB) {
            this.isBallotVisible(true);
            this.isBeginVisible(false);

            // Clear all teams for recreate them in a new match.
            this.firstTeam(-1);
            this.teamA(-1);
            this.teamB(-1);

            this.teamA(teamA);
            this.teamB(teamB);

            this.isVisible(true);

            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        beginGame: function () {
            this.isVisible(false);
            _defer.resolve(this.firstTeam());
        },

        ballot: function () {
            this.isBeginVisible(true);
            this.isBallotVisible(false);
            this.firstTeam(random(0, 2) === 0 ? this.teamA() : this.teamB());
        },

        test: function () {
            var self = this;

            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            self.show(1, 2).then(function (firstTeam) {
                alert('First turn team is ' + firstTeam);
            })

        }
    };

    return component.add(_viewModel, html, 'match');
});