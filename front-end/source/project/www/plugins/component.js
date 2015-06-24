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
        if (typeof viewModel === 'function'){
            this.name = name;
            this.isVisible = ko.observable(false);
            viewModel.call(this);
            _viewModels[name] = this;
            if (params && this.autoShow)
                this.autoShow(params);
            return this;
        }
        else{
            viewModel.name = name;
            viewModel.isVisible = ko.observable(false);
            _viewModels[name] = viewModel;
            return viewModel;
        }
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