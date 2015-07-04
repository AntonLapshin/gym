define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'server/server',
    'slider',
    'components/execute/vm',
    'components/journal/vm',
    'model/game'
], function (ko, html, c, server, slider, execute, journal, game) {

    var _exercises,
        VISIBLE_COUNT = 3,
        _index = 0,
        _weight = 0,
        _repeats = 0,
        _gymId,
        _weightSlider = null,
        _repeatsSlider = null;


    function ViewModel() {
        this.strings = c.strings;

        this.disabled = ko.observable(false);
        this.exercises = ko.observableArray();
        this.selectedExercise = ko.observable(null);
        this.left = ko.observable(false);
        this.right = ko.observable(false);
        this.weightDesc = ko.observable('');
        this.repeatsDesc = ko.observable('');

        var self = this;

        this.setVisibleExercises = function () {
            var exs = [];
            for (var i = _index; i < _exercises.length && i < _index + VISIBLE_COUNT; i++) {
                _exercises[i].active(false);
                exs.push(_exercises[i]);
            }
            this.exercises(exs);

            this.left(_index > 0);
            this.right(_index + VISIBLE_COUNT < _exercises.length);
        };

        this.loaded = function (div$) {
            _weightSlider = div$.find('.weightSlider').slider({
                formatter: function (value) {
                    _weight = value;
                    self.weightDesc(value.toFixed(1) + ' ' + c.strings.trMeasureWeight());
                    return 'Current value: ' + value;
                }
            });
            _repeatsSlider = div$.find('.repeatsSlider').slider({
                formatter: function (value) {
                    _repeats = value;
                    self.repeatsDesc(value === 0 ? c.strings.trNoLimit() : value);
                    return 'Current value: ' + value;
                }
            });
        };

        this.show = function (gymId) {
            var exercises = game.getExercises(gymId);
            _gymId = gymId;
            var self = this;
            exercises.forEach(function (ex) {
                ex.active = ko.observable(false);
            });
            exercises[0].active(true);
            _exercises = exercises;
            journal('workout').show();
            this.setVisibleExercises(0);
            this.isVisible(true);
        };

        this.prev = function () {
            _index--;
            this.setVisibleExercises();
        };

        this.next = function () {
            _index++;
            this.setVisibleExercises();
        };

        this.select = function () {
            _exercises.forEach(function (exercise) {
                exercise.active(false);
            });
            this.active(true);
            _weightSlider.slider('setAttribute', 'max', this.max);
            _weightSlider.slider('setAttribute', 'min', this.min);
            _weightSlider.slider('setAttribute', 'step', this.step);
            _weightSlider.slider('setValue', this.min);
            _repeatsSlider.slider('setAttribute', 'max', 30);
            _repeatsSlider.slider('setAttribute', 'min', 0);
            _repeatsSlider.slider('setAttribute', 'step', 1);
            _repeatsSlider.slider('setValue', 10);
            self.selectedExercise(this);
        };

        this.execute = function () {

            var args = {
                gymId: _gymId,
                exerciseId: this.selectedExercise()._id,
                weight: _weight,
                repeats: _repeats
            };

            server.execute(args)
                .then(function (result) {
                    self.disabled(true);
                    execute('workout')
                        .show(result.repeats, result.repeatsMax)
                        .then(function () {
                            self.disabled(false);
                            var approach = {
                                _id: args.exerciseId,
                                weight: args.weight,
                                repeats: result.repeats
                            };
                            journal('workout').push(approach);
                            game.fire('energy.decrease', result.energy);
                            if (result.record)
                                game.fire('record', { _id: args.exerciseId, weight: args.weight, type: result.record });
                        });
                });
        };

        this.test = function () {
            var self = this;
            this.show(0);
        }
    }

    return c.add(ViewModel, html, 'workout');
});