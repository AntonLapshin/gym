define([
    'ko',
    'text!./view.html',
    'plugins/component',
    'slider',
    'components/execute/vm',
    'model/game'
], function (ko, html, c, slider, execute, game) {

    var _defer,
        _exercises,
        VISIBLE_COUNT = 3,
        _index = 0,
        _weight = 0,
        _repeats = 0,
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
        this.history = ko.observableArray();

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

        this.show = function (exercises) {
            var self = this;
            exercises.forEach(function (ex) {
                ex.active = ko.observable(false);
            });
            exercises[0].active(true);
            _exercises = exercises;
            this.setVisibleExercises(0);
            this.isVisible(true);
            game.on('workout.executed', function(approach){
                self.disabled(true);
                execute('workout')
                    .show(approach.repeats, approach.repeatsFact)
                    .then(function(){
                        self.disabled(false);
                    });
                self.history().push(approach);
            });
            return $.Deferred(function (defer) {
                _defer = defer;
            });
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

        this.execute = function(){
            _defer.notify({
                exerciseId: this.selectedExercise()._id,
                weight: _weight,
                repeats: _repeats
            });
        };

        this.test = function () {
            var self = this;
            this.show(game.getExercises(1))
                .progress(function(approach){
                    game.fire('workout.executed', {
                        exerciseId: approach.exerciseId,
                        weight: approach.weight,
                        repeats: approach.repeats,
                        repeatsFact: approach.repeats
                    });
                });
        }
    }

    return c.add(ViewModel, html, 'workout');
});