define([
    'ko',
    'text!./view.html',
    'c',
    'server/server',
    'slider',
    'cs/execute/vm',
    'cs/journal/vm',
    'cs/wr/vm',
    'cs/pr/vm',
    'cs/buy/vm',
    'cs/energy/vm',
    'model/refs'
], function (ko, html, c, server, slider, execute, journal, wr, pr, buy, energy, Refs) {

    var _exercises,
        VISIBLE_COUNT = 3,
        _index = 0,
        _weight = 20,
        _repeats = 10,
        _gymId,
        _exerciseId,
        _weightSlider = null,
        _repeatsSlider = null;


    function ViewModel() {
        var self = this;
        this.strings = c.strings;

        this.disabled = ko.observable(false);
        this.exercises = ko.observableArray();
        this.selectedExercise = ko.observable(null);
        this.left = ko.observable(false);
        this.right = ko.observable(false);
        this.weightDesc = ko.observable('');
        this.weight = ko.observable();
        this.repeatsDesc = ko.observable('');

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

        this.onLoad = function () {
            _weightSlider = self.elem$.find('.weightSlider').slider({
                formatter: function (value) {
                    _weight = value;
                    self.weight(value.toFixed(1));
                    self.weightDesc(value.toFixed(1) + ' ' + c.strings.trMeasureWeight());
                    return 'Current value: ' + value;
                }
            });
            _repeatsSlider = self.elem$.find('.repeatsSlider').slider({
                formatter: function (value) {
                    _repeats = value;
                    self.repeatsDesc(value === 0 ? c.strings.trNoLimit() : value);
                    return 'Current value: ' + value;
                }
            });
        };

        this.init = function () {
            journal('workout').init().show();
            wr('workout').init().show();
            pr('workout').init().show();
            buy('workout').init().show();
            energy('workout').init().show();
            execute('workout').init();

            c.on('execute.finished', function () {
                self.disabled(false);
                journal('workout').push(self.approach);
                c.fire('energy.decrease', self.approach.result.energy);

                $.each(self.approach.result.records, function (i, type) {
                    var record = {
                        exerciseId: _exerciseId,
                        weight: _weight,
                        type: type
                    };
                    c.fire('record', record);
                });

                if (self.approach.result.records.length > 0) {
                    self.reload();
                }

                if (self.approach.result.repeats >= 1)
                    c.fire('player.load');
            });

            return self;
        };

        this.reload = function(){
            self.set(_gymId);
            var exercise = $.grep(_exercises, function (e) {
                return e._id === _exerciseId;
            })[0];
            self.select(exercise);
            return self;
        };

        this.set = function (gymId) {
            _exercises = Refs.getExercises(gymId);
            _gymId = gymId;
            var self = this;
            _exercises.forEach(function (ex) {
                ex.active = ko.observable(false);
            });
            _exercises[0].active(true);
            this.setVisibleExercises(0);
            return self;
        };

        this.prev = function () {
            _index--;
            this.setVisibleExercises();
        };

        this.next = function () {
            _index++;
            this.setVisibleExercises();
        };

        this.select = function (ex) {
            ex = ex || this;
            _exercises.forEach(function (exercise) {
                exercise.active(false);
            });
            ex.active(true);
            _weightSlider.slider('setAttribute', 'max', ex.max * Refs.getGyms()[_gymId].weight);
            _weightSlider.slider('setAttribute', 'min', ex.min);
            _weightSlider.slider('setAttribute', 'step', ex.step);
            _weightSlider.slider('setValue', _weight);
            _repeatsSlider.slider('setAttribute', 'max', 30);
            _repeatsSlider.slider('setAttribute', 'min', 0);
            _repeatsSlider.slider('setAttribute', 'step', 1);
            _repeatsSlider.slider('setValue', _repeats);
            self.selectedExercise(ex);
            _exerciseId = ex._id;

            wr('workout').set(ex.wr);
            pr('workout').set(ex.pr);
            if (ex.disabled)
                buy('workout').set(ex.cost);
            buy('workout')[ex.disabled ? 'show' : 'hide']();
            energy('workout').set(ex.energy);
        };

        this.execute = function () {
            var approach = {
                gymId: _gymId,
                exerciseId: _exerciseId,
                weight: _weight,
                repeats: _repeats
            };

            self.approach = approach;

            server.workoutExecute(approach)
                .then(function (result) {
                    self.approach.result = result;
                    self.disabled(true);
                    execute('workout')
                        .start(result.repeats, result.repeatsMax)
                        .show();
                });
        };

        this.test = function () {
            this.init().set(1).show();
        }
    }

    return c.add(ViewModel, html, 'workout');
});