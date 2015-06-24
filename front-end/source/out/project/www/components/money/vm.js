System.registerModule("../../../../../project/www/components/money/vm.js", [], function() {
  "use strict";
  var __moduleName = "../../../../../project/www/components/money/vm.js";
  define(['ko', 'text!./view.html', 'plugins/component'], function(ko, html, component) {
    function ViewModel() {
      this.title = component.strings.bankMoney;
      this.show = function(value) {
        this.value = value;
        this.isVisible(true);
        var name = "Bob",
            time = "today";
        console.log('Hello ${name}, how are you ${time}?');
      };
      this.test = function() {
        var v = ko.observable(10);
        this.show(v);
        v(15);
      };
      this.click = function() {
        alert('buy money');
      };
    }
    return component.add(ViewModel, html, 'money');
  });
  return {};
});
System.get("../../../../../project/www/components/money/vm.js" + '');
