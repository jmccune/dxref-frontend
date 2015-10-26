import Ember from 'ember';

export default Ember.Controller.extend({
	authenticationService: Ember.inject.service('authentication-service'),
	actions: {		
		login: function(/*pageInfo*/) {
			var service =this.get('authenticationService');
			//Clear message from previous login attempt
			this.set('message',null);

			// Data from current login attempt.
			var username = this.get('username');
			var password = this.get('password');

			//Do Validation
			var message = service.validateUsernamePassword(username,password);
			if (message) {
				this.setMessage(false,message);
				return;
			}				
					
			// Now attempt to do the login...
			var _this = this;
			
			service.login(username,password).then(function(errorMessage){
				if (errorMessage) {
					_this.setMessage(false,errorMessage);
					return;
				}

				_this.setMessage(true,"Successfully logged in!<br> Please navigate where you wish to!");
				
				var transition = service.get('attemptedTransition');
				
				if (transition) {
					transition.retry();
					service.set('attemptedTransition',null);
				}

			});
		},	
		cancel: function() {
			this.set('username','');
			this.set('password','');

		}
	},  
	setMessage: function(good, message) {
		this.set('message',message);
		this.set('isError',!good);
	}
});