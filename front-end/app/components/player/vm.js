define(["ko","text!./view.html","c","model/player"],function(e,t,n,r){function i(){var e=this;this.set=function(e){var t=this,n=new r(e);return n.load().then(function(){t.model(n)}),t},this.click=function(t){n.fire("player.click",e.model()._id)},this.test=function(){this.init().set(60981233).show()}}return n.add(i,t,"player")});