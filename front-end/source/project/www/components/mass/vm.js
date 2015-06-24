define([
    'ko',
    'text!./view.html',
    'plugins/component'
], function(ko, html, component) {

    function ViewModel() {

        this.title = component.strings.massAdd;
        this.unit = component.strings.massUnit;

        this.test = function(){
            var v = ko.observable(10);
            this.show(v);
            v(82.5);
        };

        this.click = function(){
            alert('add mass');
        };
    }

    return component.add(ViewModel, html, 'mass');
});