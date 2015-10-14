import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';

function passwordComplexity(password) {
	var charMap={};
	var complexityCount=0;
	_.forEach(password,function(ch) {
		if (charMap[ch]) {
			return;
		}
		charMap[ch]=1;
		complexityCount++;
	});

	return complexityCount;
}

export default Ember.Controller.extend({
	authenticationService: Ember.inject.service('authentication-service'),
	actions: {		
		login: function(pageInfo) {
			

			//Clear message from previous login attempt
			this.set('message',null);

			// Data from current login attempt.
			var username = this.get('username');
			var password = this.get('password');

			//Do Validation
			var message = this.validateUsernamePassword(username,password);
			if (message) {
				this.set('message',message);
				return;
			}				
					
			// Now attempt to do the login...
			var _this = this;
			var service =this.get('authenticationService');			
			service.login(username,password).then(function(errorMessage){
				if (errorMessage) {
					_this.set('message',errorMessage);
					return;
				}

				_this.set('message',"SUCCESSFULLY LOGGED IN!");
				console.log("*** HERE*");
				var transition = service.get('attemptedTransition');
				console.log("*******>> TRANSITION ATTEMPTED -- do we have it?");
				console.dir(transition);
				if (transition) {
					transition.retry();
					service.set('attemptedTransition',null);
				}

			});
		},	
		cancel: function() {
			this.set('username','');
			this.set('password','');
			console.log("CURRENT SECURITY TOKEN: "+theUserService.getSecurityToken());
		}
	},  

	validateUsernamePassword: function(username, password) {		
		var message = '';
		if (!username) {
			message = "Username is required!";
		}
		if (!password) {
			message+= "\nPassword is required! ";
		}
		else if (password.length<10) {
			message+= "\nPassword must be at least 10 characters!";
		}
		else if (passwordComplexity(password)<6) {
			message+= "\nPassword is too simple!  Use different letters/symbols/numbers!";
		}

		return message;

	},
  	loadData:function(pageNum) {
	  	// var _this = this;	  	

	   //  theDataService.getData(Constants.DXREF_SERVICE,'/contents',{pageNum: pageNum}).then(function(data) {
	   //      var pagedItems = new PagedItems(data,listItemModel);             
	   //      var newData= pagedItems.adaptForComponent("prevPage","nextPage");
	   //      console.log("*****>>> ");
	   //      console.dir(newData);
	   //      _this.set('model',newData);
	   //  });	    
	}
});