define(['ko', 'jquery', 'plugins/localization', 'plugins/format'], function (ko, $, strings, format) {

    var _events = {};
    var _viewModels = {};

    function random(min, max) {
        return (Math.random() * (max - min) + min) | 0
    }

    function getName(params, viewName){
        if (typeof params === 'string')
            return viewName + '+' + params;

        return viewName + '+' +
            (params ? (typeof params.name === 'function' ? params.name() : params.name) || 'default' : 'default');
    }

    function ViewModel(name, viewModel, params){
        var vm = typeof viewModel === 'function' ? this : viewModel;
        vm.name = name;
        vm.model = ko.observable(null);
        vm.isVisible = ko.observable(false);
        vm.show = function(){
            vm.isVisible(true);
            if (vm.onShow)
                vm.onShow();
            return vm;
        };
        vm.hide = function(){
            vm.isVisible(false);
            return vm;
        };
        vm.set = function(model){
            vm.model(model);
            return vm;
        };
        vm.update = function(){
            return vm;
        };
        vm.init = function(){
            return vm;
        };
        vm.load = function(elem){
            if (vm.onLoad)
                vm.onLoad($(elem));
        };
        vm.reload = function(){
            return vm;
        };
        _viewModels[name] = vm;

        if (typeof viewModel === 'function'){
            viewModel.call(this, name);
            if (params && params.model)
                vm.init().set(params.model).show();
        }

        return vm;
    }

    function getViewModel(params, viewName, viewModel){
        var name = getName(params, viewName);
        if (_viewModels[name]){
            if (params && params.model && typeof viewModel === 'function' && _viewModels[name].set)
                _viewModels[name].set(params.model);
            return _viewModels[name];
        }

        return new ViewModel(name, viewModel, params);
    }

    var component = {
        random: random,
        format: format,
        strings: strings,
        viewModels: _viewModels,
        add: function(viewModel, html, name){
            var component = {
                viewModel: function (params) {
                    return getViewModel(params, name, viewModel);
                }, template: html
            };
            if (!ko.components.isRegistered(name)) {
                ko.components.register(name, component);
            }

            return component.viewModel;
        },
        on: function(event, el){
            if (!_events.hasOwnProperty(event)) {
                _events[event] = [];
            }
            _events[event].push(el);
        },
        fire: function(event, args){
            if (_events.hasOwnProperty(event)) {
                $.each(_events[event], function(i, el){
                    el(args);
                });
            }
        }
    };

    ko.c = component;

    ko.c.on('component.loaded', function(data){
        ko.applyBindingsToNode(data.elem, { visible: data.vm.isVisible }, data.vm );
        data.vm.load(data.elem);
    });

    return component;
});