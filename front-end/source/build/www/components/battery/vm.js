define(["ko","text!./view.html","plugins/component"],function(e,t,n){function r(){this.red=e.observable(),this.yellow=e.observable(),this.title=n.strings.bankEnergy,this.show=function(t,n){this.max=t,this.value=n,this.percent=e.computed(function(){return this.value()/this.max()*100+"%"},this),this.red=e.computed(function(){return this.max()*.33},this),this.yellow=e.computed(function(){return this.max()*.66},this),this.valueDesc=e.computed(function(){return this.value()+"/"+this.max()},this),this.isVisible(!0)},this.click=function(){alert("global event: buy battery")},this.test=function(){function i(){n(r),r<t()&&window.setTimeout(i,20),r++}var t=e.observable(155),n=e.observable(115);this.show(t,n);var r=0;window.setTimeout(i,1e3)}}return n.add(r,t,"battery")});