define(["ko","text!./view.html","plugins/component"],function(e,t,n){var r,i=n.strings,s=[{name:i.menuHome,active:e.observable(!0)},{name:i.menuTraining,active:e.observable(!1)},{name:i.menuRest,active:e.observable(!1)},{name:i.menuAwards,active:e.observable(!1)},{name:i.menuShop,active:e.observable(!1)}],o={items:e.observableArray(s),show:function(){return this.isVisible(!0),$.Deferred(function(e){r=e})},select:function(){s.forEach(function(e){e.active(!1)}),this.active(!0);var e=o.items().indexOf(this);r.notify(e)},test:function(){this.show().progress(function(e){console.log("Selected item is "+e)})}};return n.add(o,t,"menu")});