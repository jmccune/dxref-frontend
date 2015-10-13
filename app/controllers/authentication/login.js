import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theUserService from 'dxref/services/user-service';

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

	actions: {		
		login: function(pageInfo) {
			console.log("LOGIN!!");		
			console.log(this.get('password'));
			console.log(this.get('username'));

			theUserService.clearSecurityToken();
			this.set('message',null);
			var username = this.get('username');
			var password = this.get('password');
			var message = this.validateUsernamePassword(username,password);
			if (message) {
				this.set('message',message);
				return;
			}

			console.log("** TRYING TO LOGIN!");
			theUserService.login(username,password);
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