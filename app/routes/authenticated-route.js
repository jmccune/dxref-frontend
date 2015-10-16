import Ember from 'ember';

var logger = log4javascript.getLogger("dxref.routers.authenticated-route");

export default Ember.Route.extend({
	authenticationService: Ember.inject.service('authentication-service'),
	beforeModel(transition) {
		var service =this.get('authenticationService');
		if (!service.isLoggedIn()) {
			this.redirectToLogin(transition);
		}
	},
	redirectToLogin(transition) {
		var service =this.get('authenticationService');
		service.set('attemptedTransition',transition);
		this.transitionTo('authentication.login');
	},
 	actions: {
		error:function(reason,transition) {				
			if (reason.status===403) {		
				logger.info("403 >> LOGIN REQUIRED >> Afterwards return to: "+transition.targetName);				
				this.redirectToLogin(transition);
			}
		}
	}	
});