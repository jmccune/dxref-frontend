 import Ember from 'ember';

 export default Ember.Route.extend({
  model() {

  	var resolveFn = null;
  	var promise =  new Ember.RSVP.Promise(function(resolve,reject) {
  		resolveFn = resolve;
  	});

  	setTimeout(function(){
  		console.log("*** TIMEOUT WENT!");
  		console.log("resolveFn: "+resolveFn);
  		resolveFn({});
  	},1000);


    return promise;
  }
});