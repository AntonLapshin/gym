define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'c/scores/vm',
    'c/psychic/vm',
    'c/twist/vm',
    'engine/game',
    'plugins/localization'
], function (ko, html, component, scores, psychic, twist, game, strings) {

    $('*').on('selectstart', function () {
        return false;
    });

    var _defer;

    var _viewModel = {
        isVisibleMeta: ko.observable(false),
        text: ko.observable(''),

        show: function (teamA, teamB, moveTeamAB, playerTeamAB) {
            scores.show(teamA, teamB, playerTeamAB, moveTeamAB);
            psychic.show();

            var self = this;

            function showMessage(text, next) {
                self.text(text);
                self.isVisibleMeta(true);
                setTimeout(function () {
                    self.isVisibleMeta(false);
                    if (next != undefined)
                        next();
                }, 2000);
            }

            function eventHandler(state) {
                switch (state) {
                    case 'loaded':
                        self.isVisible(true);
                        game.start(scores.getRound(), playerTeamAB === scores.getMoveTeamAB());
                        break;
                    case 'start':
                        self.isVisible(true);
                        showMessage(playerTeamAB === scores.getMoveTeamAB() ? strings.turnPlayer() : strings.turnComputer());
                        break;
                    case 'goal':
                        game.stop(1500);
                        showMessage(strings.goal(), function () {
                            result(true);
                        });
                        break;
                    case 'end':
                        game.stop(0);
                        showMessage(strings.miss(), function () {
                            result(false);
                        });
                        break;
                    case 'crossbar':
                        showMessage(strings.crossbar());
                        break;
                }
            }

            function result(isGoal) {
                if (window.cfg.debug){
                    self.isVisible(false);
                    scores.isVisible(false);
                    psychic.isVisible(false);
                    _defer.resolve(1, 0);
                    return;
                }
                var text = scores.next(isGoal);

                if (!text){
                    game.start(scores.getRound(), playerTeamAB === scores.getMoveTeamAB());
                    return;
                }

                showMessage(text, function () {
                    self.isVisible(false);
                    psychic.isVisible(false);
                    scores.isVisible(false);
                    _defer.resolve(scores.goalsA(), scores.goalsB());
                });
            }

            game.load().progress(eventHandler);

            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        test: function () {
            var self = this;
            require(['plugins/options', 'plugins/loader'], function (options, loader) {
                loader.load(loader.resources.ENGINE).then(function () {
                    self.show(options.teams[0], options.teams[1], 'A', 'A').
                        then(function (goals1, goals2) {
                            alert(goals1 + ' : ' + goals2);
                        });
                });
            });
        }
    };

    return component.add(_viewModel, html, 'game');
});