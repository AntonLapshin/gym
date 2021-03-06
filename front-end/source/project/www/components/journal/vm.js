define([
    'ko',
    'jquery',
    'text!./view.html',
    'c',
    'model/refs'
], function (ko, $, html, c, Refs) {

    function ViewModel() {

        this.strings = c.strings;

        this.journal = ko.observableArray();

        this.init = function(){
            this.model([]);
            this.update();
            return this;
        };

        this.update = function(){
            if (!this.model())
                return [];
            var journal = {};

            $.each(this.model(), function(i, approach){
                if (!journal[approach.exerciseId])
                    journal[approach.exerciseId] = [];

                journal[approach.exerciseId].push(approach);
            });

            var output = [];

            $.each(journal, function(key, value){
                var ex = {
                    name: Refs.getExercise(key).name,
                    approaches: $.map(value, function(approach){
                        return c.format('<span class="label label-default">{0}x{1}</span>', approach.weight, Math.floor(approach.result.repeats));
                    }).join('')
                };
                output.push(ex);
            });

            this.journal(output);
        };

        this.push = function(approach){
            this.model().push(approach);
            this.update();
        };

        this.test = function(){
            this.init().show();
            this.push({ exerciseId: 0, weight: 70, repeats: 10, result: { repeats: 9 } });
            this.push({ exerciseId: 0, weight: 70, repeats: 10, result: { repeats: 9 } });
        }

    }

    return c.add(ViewModel, html, 'journal');
});