import Ember from 'ember';

export default Ember.Controller.extend({
	authenticationService: Ember.inject.service('authentication-service'),
	timeoutId: null,
	init() {
		this._super();
		this.set('isInvalid',true);
	},
	validate() {
		var service =this.get('authenticationService');
		var username = this.get('username');
		var password = this.get('password');
		var givenName = this.get('givenName');
		var familyName = this.get('familyName');

		//Clear previous validation(s)
		this.set('isInvalid',true);
		this.setMessage(false,null);

		//Do Validation		
		var message = service.validateUsernamePassword(username,password);
		if (message) {
			this.setMessage(false,message);
			return;
		}	
		if (!givenName) {
			this.setMessage(false,"Please give a given name!");
			return;
		}
		if (!familyName) {
			this.setMessage(false,"Please provide your family name!");
			return;
		}
		
		// Success
		this.set('isInvalid',false);
		//No message set -- no error yet...
		return true;
	},
	setMessage(good, message) {
		this.set('message',message);
		this.set('isError',!good);
	},
	actions: {	
		
		kvalidate() {
			window.clearTimeout(this.timeoutId);
			var _this=this;
			this.timeoutId = window.setTimeout(function() {
				_this.validate();
			},250);
		},
		submit() {
			console.log("*** SUBMIT!");
		}	
	}
});