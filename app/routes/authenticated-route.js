import Ember from 'ember';

export default Ember.Route.extend({
	authenticationService: Ember.inject.service('authentication-service'),
 	actions: {
		error:function(reason,transition) {				
			if (reason.status===403) {		
				console.log("*** ATTEMPT TRANSITION ***");
				var service =this.get('authenticationService');
				service.set('attemptedTransition',transition);
				this.transitionTo('authentication.login');
			}
		}
	}	
});