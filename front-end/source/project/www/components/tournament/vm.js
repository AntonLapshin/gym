define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/team/vm',
    'plugins/localization',
    'model/teams'
], function (ko, html, component, team, strings, teams) {

    var _defer;

    function random(min, max) {
        return (Math.random() * (max - min) + min) | 0
    }

    function getTeamPairs() {
        var pairs8 = [],
            indicies = [],
            indexA,
            indexB,
            teamA,
            teamB,
            pair,
            i;

        for (i = 0; i < teams.length; i++) {
            indicies.push(i);
        }

        while (indicies.length > 0) {
            indexA = random(0, indicies.length);
            teamA = indicies[indexA];
            indicies.splice(indexA, 1);
            indexB = random(0, indicies.length);
            teamB = indicies[indexB];
            indicies.splice(indexB, 1);
            pair = {teamA: teamA, teamB: teamB, score: ko.observable('-:-')};
            pairs8.push(pair);
        }

        return pairs8;
    }

    function calcGoals(koeff) {
        var goals = 0;
        for (var i = 0; i < 5; i++) {
            if (random(0, 10 + koeff) > 4)
                goals++;
        }
        return goals;
    }

    function setWinner(pair, goalsA, goalsB) {
        pair.score('' + goalsA + ':' + goalsB);
        pair.winner = goalsA > goalsB ? pair.teamA : pair.teamB;
    }

    var _round,
        _playerTeamIndex;

    var _viewModel = {
        isGoRoundButtonVisible: ko.observable(false),
        rounds: ko.observableArray(),
        teams: teams,
        champion: ko.observable(-1),
        txtGoRound: strings.txtGoRound,

        show: function (playerTeamIndex) {
            _round = 0;
            _playerTeamIndex = playerTeamIndex;

            this.isVisible(true);
            this.isGoRoundButtonVisible(true);
            this.rounds.push(getTeamPairs());

            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        goRound: function () {
            var self = this;
            this.isGoRoundButtonVisible(false);

            var pairs = this.rounds()[_round];

            var match = {
                round: _round
            };

            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if (_playerTeamIndex === pair.teamA ||
                    _playerTeamIndex === pair.teamB) {
                    match.pair = pair;

                    this.isVisible(false);
                    _defer.notify('match', match);
                }
                else {
                    var tA = teams[pair.teamA];
                    var tB = teams[pair.teamB];
                    var goalsA = calcGoals(tA.power - tB.power);
                    var goalsB = calcGoals(tB.power - tA.power);
                    if (goalsA === goalsB) {
                        if (tA.power - tB.power > 0)
                            goalsA++;
                        else
                            goalsB++;
                    }
                    setWinner(pair, goalsA, goalsB);
                }
            }
        },

        matchEnded: function (match) {
            this.isVisible(true);
            setWinner(match.pair, match.goalsA, match.goalsB);
            this.setNewTeamPairs();
            if (match.pair.winner !== _playerTeamIndex) {
                var place;
                switch (_round) {
                    case 0:
                        place = 16;
                        break;
                    case 1:
                        place = 8;
                        break;
                    case 2:
                        place = 4;
                        break;
                    case 3:
                        place = 2;
                        break;
                }
                this.isVisible(false);
                _defer.notify('end', place);
            }
        },

        setNewTeamPairs: function () {
            var newPairs = [];
            var pairs = this.rounds()[_round];

            if (_round === 3) {
                var champ = pairs[0].winner;
                if (champ === _playerTeamIndex) {
                    this.isVisible(false);
                    _defer.notify('end', 1);
                }
                this.champion(champ);
                return;
            }

            for (var i = 0; i < pairs.length; i = i + 2) {
                var pair = {teamA: pairs[i].winner, teamB: pairs[i + 1].winner, score: ko.observable('-:-')};
                newPairs.push(pair);
            }

            this.rounds.push(newPairs);
            this.isGoRoundButtonVisible(true);
            _round++;
        },

        test: function () {
            var self = this;

            require(['plugins/loader'], function (loader) {
                loader.load(loader.resources.GAME).then(function () {
                });
            });

            require(['plugins/options'], function (options) {
                options.init(5);
                self.show(5).progress(function (type, args) {
                    console.log(type + ': ' + JSON.stringify(args));

                    if (type === 'match') {
                        args.goals1 = 5;
                        args.goals2 = 2;
                        self.isVisible(true);
                        setTimeout(function () {
                            self.matchEnded(args);
                        });
                    }
                    else if (type === 'end') {
                        alert('Your place is ' + args);
                    }
                })
            });
        }
    };

    return component.add(_viewModel, html, 'tournament');
});