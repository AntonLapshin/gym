define(['ko', 'plugins/localization', 'plugins/format'], function (ko, strings, format) {

    ko.bindingHandlers.loaded = {
        init: function(elemDom) {
            var viewModel = ko.contextFor(elemDom).$rawData;
            if (viewModel.loaded)
                viewModel.loaded($(elemDom));
        }
    };

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
        vm.show = function(model){
            vm.isVisible(true);
            vm.model(model);
        };
        _viewModels[name] = vm;

        if (typeof viewModel === 'function'){
            viewModel.call(this);
            if (params && this.autoShow)
                this.autoShow(params);
        }

        return vm;
    }

    function getViewModel(params, viewName, viewModel){
        var name = getName(params, viewName);
        if (_viewModels[name]){
            if (params && typeof viewModel === 'function' && _viewModels[name].set)
                _viewModels[name].set(params);
            return _viewModels[name];
        }

        return new ViewModel(name, viewModel, params);
    }

    var component = {
        random: random,
        format: format,
        strings: strings,
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
        }
    };

    return component;
});