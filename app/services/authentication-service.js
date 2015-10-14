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
  userInfo: null,

  init() {
    this._super(...arguments);
    this.set('securityToken', currentSecurityToken);
    this.set('userInfo',null);
    theDataService.setSecurityToken(currentSecurityToken);
  },


  /** Login a user -- implicitly logs out any previously logged in user. */
  login(username,password) {

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
      console.log("****");
      console.dir(responseInfo);
      _this.setSecurityToken(X_AUTH);      

      _this.set('userInfo',response.extraData);
    
      return null;
    });

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