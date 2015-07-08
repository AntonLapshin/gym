define([
    'ko',
    'jquery',
    'text!./view.html',
    'plugins/component',
    'model/game'
], function (ko, $, html, c, game) {

    function ViewModel() {

        this.strings = c.strings;

        this.journal = ko.observableArray();

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
                    name: game.getExercise(key).name,
                    approaches: $.map(value, function(approach){
                        return c.format('{0}x{1}', approach.weight, approach.repeats);
                    }).join(',')
                };
                output.push(ex);
            });

            this.journal(output);
        };

        this.init = function(){
            this.model([]);
            this.update();
        };

        this.push = function(approach){
            this.model().push(approach);
            this.update();
        };

        this.test = function(){
            this.show().init();
            this.push({ _id: 0, weight: 70, repeats: 10 });
        }

    }

    return c.add(ViewModel, html, 'journal');
});