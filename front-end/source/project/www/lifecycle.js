define([
    'ko',
    'plugins/loader',
    'plugins/options',
    'social/social',
    'c/lang/vm',
    'c/info/vm',
    'c/timer/vm',
    'c/sound/vm',
    'c/top/vm',
    'c/intro/vm',
    'c/instruction/vm',
    'c/choice/vm',
    'c/tournament/vm',
    'c/match/vm',
    'c/load/vm',
    'c/game/vm'
], function (ko,
             loader,
             options,
             social,
             lang,
             info,
             timer,
             sound,
             top,
             intro,
             instruction,
             choice,
             tournament,
             match,
             load,
             game) {

    ko.applyBindings({});
    loader.load(loader.resources.GAME)
        .then(function () {
            return options.load();
        })
        .then(function () {
            lang.show();
            info.init(options.player);
            timer.show(options.player.last);
            sound.show();
            top.show(options.player);
            return intro.show();
        })
        .progress(function (type) {
            if (type === 'rules') {
                info.isVisible(false);
                intro.isVisible(false);
                instruction.show()
                    .then(function () {
                        intro.isVisible(true);
                    });
                return;
            }

            if (timer.highlight())
                return;

            intro.isVisible(false);
            options.save();
            info.isVisible(false);
            top.isVisible(false);

            var _playerTeamIndex,
                _firstTeamIndex,
                _firstTeamAB,
                _playerTeamAB;

            choice.show()
                .then(function (playerTeamIndex) {
                    _playerTeamIndex = playerTeamIndex;
                    options.init(playerTeamIndex);
                    return tournament.show(playerTeamIndex);
                })
                .progress(function (type, args) {
                    if (type === 'end') {
                        var place = args;
                        options.upgrade();
                        var score = (17 - place) * 1000 + options.goals * 10 + options.player.exp * 15 + options.player.goals;
                        if (score > options.player.score)
                            options.player.score = score;
                        options.save();

                        function resultsHandler() {
                            top.isVisible(true);
                            result.show(
                                score,
                                place,
                                options.teams[_playerTeamIndex],
                                options.goals
                            );
                        }

                        if (window.cfg.publish) {
                            social.wallPost(place).then(resultsHandler);
                        }
                        else {
                            resultsHandler();
                        }
                        return;
                    }
                    // --------------------------------------------------------------------- NEW MATCH
                    match.show(args.pair.teamA, args.pair.teamB)
                        .then(function (firstTeamIndex) {
                            _firstTeamIndex = firstTeamIndex;
                            return $.when.apply($, [
                                loader.load(loader.resources.ENGINE, function (percent) {
                                    load.onPercentChanged(percent);
                                }),
                                load.show('Начать игру')
                            ]);
                        })
                        .then(function () {
                            _firstTeamAB = _firstTeamIndex === args.pair.teamA ? 'A' : 'B';
                            _playerTeamAB = _playerTeamIndex === args.pair.teamA ? 'A' : 'B';

                            return game.show(
                                options.teams[args.pair.teamA],
                                options.teams[args.pair.teamB],
                                _firstTeamAB,
                                _playerTeamAB
                            );
                        })
                        .then(function (goalsA, goalsB) {
                            args.goalsA = goalsA;
                            args.goalsB = goalsB;
                            if (_playerTeamAB == 'A') {
                                options.goals += goalsA;
                                options.miss += goalsB;
                            }
                            tournament.matchEnded(args)
                        });
                });
        });
});