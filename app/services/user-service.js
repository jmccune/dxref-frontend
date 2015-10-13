import theDataService from 'dxref/services/data-service';
import {Constants} from 'dxref/dxref-config';

export function UserService() {

}

var currentSecurityToken = null;
if(typeof(Storage) !== "undefined") {
    currentSecurityToken = localStorage.getItem("currentSecurityToken");
} else {
    // Sorry! No Web Storage support..
}

/**
Returns a message (non-null) if there was a problem.	
*/
UserService.prototype.login = function(username,password) {
	theDataService.postData(Constants.AUTH_SERVICE,'/authentication/login',{},
		{ username: username, password: password}).
		then(function(responseInfo) {

			var response = responseInfo.response;
			if (!response.success) {
				return response.message;
			}

			var headers =responseInfo.jqXhr.getAllResponseHeaders();			
			var X_AUTH = responseInfo.jqXhr.getResponseHeader("X-AUTH-TOKEN");
			if (!X_AUTH) {
				return "Unable to login... some error has occurred.";
			}
			currentSecurityToken = X_AUTH;
			localStorage.setItem("currentSecurityToken",currentSecurityToken);
			console.log(X_AUTH);

			//Successfullly logged in-- NO ERROR MESSAGE.
			return null;
		});
}

UserService.prototype.getCurrentUserInfo =function() {
	return null;
}

UserService.prototype.getSecurityToken=function() {
	return currentSecurityToken;
}

UserService.prototype.clearSecurityToken=function() {
	currentSecurityToken= null;
	if(typeof(Storage) !== "undefined") {
    	currentSecurityToken = localStorage.removeItem("currentSecurityToken");
	}
}


var theUserService = new UserService;
export default theUserService;