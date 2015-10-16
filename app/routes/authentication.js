import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transiton) {  	
  	if (transiton.targetName==='authentication.index') {
    	this.transitionTo('authentication.login');
    }
  } 
});