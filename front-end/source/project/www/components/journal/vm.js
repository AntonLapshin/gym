define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
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
                if (!journal[approach._id])
                    journal[approach._id] = [];

                journal[approach._id].push(approach);
            });

            var output = [];

            $.each(journal, function(key, value){
                var ex = {
                    name: Refs.getExercise(key).name,
                    approaches: $.map(value, function(approach){
                        return c.format('{0}x{1}', approach.weight, approach.repeats);
                    }).join(',')
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
            this.push({ _id: 0, weight: 70, repeats: 10 });
        }

    }

    return c.add(ViewModel, html, 'journal');
});