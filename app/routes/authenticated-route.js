import Ember from 'ember';
import loginController from 'dxref/controllers/authentication/login';

export default Ember.Route.extend({
 actions: {
		error:function(reason,transition) {
			console.log("****** ERRROR>>>> ");
			console.dir(reason);
			console.dir(transition);
			if (reason.status===403) {
				alert("YOU MUST LOGIN!");
				// console.log("*** TRNASITION");
				// console.dir(transition);
				
				this.transitionTo('authentication.login');
				loginController.set('attemptedTransition',transition);
				
			}
		}
	}	
});