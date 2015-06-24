define([
    'ko',
    'text!./view.html',
    'slider',
    'components/execute/vm',
    'plugins/component'
], function (ko, html, slider, execute, component) {

    var strings = component.strings;

    var _defer,
        _exercises,
        VISIBLE_COUNT = 3,
        _index = 0,
        _weight = 0,
        _repeats = 0,
        _weightSlider = null,
        _repeatsSlider = null;


    var _viewModel = {
        chooseWeight: strings.trChooseWeight,
        chooseRepeats: strings.trChooseRepeats,
        measureWeight: strings.trMeasureWeight,
        noLimit: strings.trNoLimit,
        executeBtn: strings.trExecute,

        exercises: ko.observableArray(),
        selectedExercise: ko.observable(null),
        left: ko.observable(false),
        right: ko.observable(false),

        weightDesc: ko.observable(''),
        repeatsDesc: ko.observable(''),

        setVisibleExercises: function () {
            var exs = [];
            for (var i = _index; i < _exercises.length && i < _index + VISIBLE_COUNT; i++) {
                _exercises[i].active(false);
                exs.push(_exercises[i]);
            }
            this.exercises(exs);

            this.left(_index > 0);
            this.right(_index + VISIBLE_COUNT < _exercises.length);
        },

        loaded: function (div$) {
            _weightSlider = div$.find('.weightSlider').slider({
                formatter: function (value) {
                    _weight = value;
                    _viewModel.weightDesc(value.toFixed(1) + ' ' + _viewModel.measureWeight());
                    return 'Current value: ' + value;
                }
            });
            _repeatsSlider = div$.find('.repeatsSlider').slider({
                formatter: function (value) {
                    _repeats = value;
                    _viewModel.repeatsDesc(value === 0 ? _viewModel.noLimit() : value);
                    return 'Current value: ' + value;
                }
            });
        },

        show: function (exercises) {
            var self = this;
            exercises.forEach(function (ex) {
                ex.active = ko.observable(false);
            });
            exercises[0].active(true);
            _exercises = exercises;
            this.setVisibleExercises(0);
            this.isVisible(true);
            return $.Deferred(function (defer) {
                _defer = defer;
            });
        },

        prev: function () {
            _index--;
            this.setVisibleExercises()
        },

        next: function () {
            _index++;
            this.setVisibleExercises()
        },

        select: function () {
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
            _viewModel.selectedExercise(this);
        },

        execute: function(){
            _defer.notify({
                exerciseId: this.selectedExercise().id,
                weight: _weight,
                repeats: _repeats
            });
        },

        showExecuting: function(repeatsPlan, repeatsFact){
            execute('training').show(repeatsPlan, repeatsFact);
        },

        test: function () {
            var self = this;
            require(['model/exercises'], function (exercises) {
                self.show(exercises)
                    .progress(function(approach){
                        console.log(JSON.stringify(approach));
                        self.showExecuting(approach.repeats, component.random(0, 100) / 10);
                    });
            });
        }
    };

    return component.add(_viewModel, html, 'training');
});