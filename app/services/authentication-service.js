import theDataService from 'dxref/services/data-service';
import {Constants} from 'dxref/dxref-config';

var currentSecurityToken = null;
if(typeof(Storage) !== "undefined") {
    currentSecurityToken = localStorage.getItem("currentSecurityToken");
} else {
    // Sorry! No Web Storage support..
}

export default Ember.Service.extend({
  attemptedTransiton: null,
  items: null,


  init() {
    this._super(...arguments);
    this.set('securityToken', currentSecurityToken);
    theDataService.setSecurityToken(currentSecurityToken);
  },




  /** Login a user -- implicitly logs out any previously logged in user. */
  loginOnly(username,password) {

    //clear out the security token...
    this.clearSecurityToken();

    var _this=this;
    var data = {username: username, password: password};
    var promise =  theDataService.postData(Constants.AUTH_SERVICE,'/authentication/login',{},data).
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
      _this.setSecurityToken(X_AUTH);      
      console.log(X_AUTH);
    
      return null;
    });

    return promise;
  },

  login(username,password) {
    var promise =this.loginOnly(username,password);

    return promise;
  },

  // === SECURITY -TOKEN ====
  clearSecurityToken() {
    this.set('securityToken',null);
    localStorage.removeItem("currentSecurityToken");
    theDataService.setSecurityToken(null);
  },
  setSecurityToken(token) {
    this.set('securityToken',token);
    localStorage.setItem("currentSecurityToken",token);
    theDataService.setSecurityToken(token);
  },
  getSecurityToken() {
    return this.get('securityToken');
  }  
});