import Ember from 'ember';
import theDataService from 'dxref/services/data-service';
import {Constants} from 'dxref/dxref-config';

// var currentSecurityToken = null;
// if(typeof(Storage) !== "undefined") {
//     currentSecurityToken = localStorage.getItem("currentSecurityToken");
// } else {
//     // Sorry! No Web Storage support..
// }


var localStorageManager = {
  localStorageIsUsable: false,
  initialize: function() {
    if(typeof(Storage) !== "undefined") {
        localStorageManager.localStorageIsUsable=true;        
    } 
  },
  setUser: function(securityToken, userInfo) {
    if (!this.localStorageIsUsable) {
      return;
    }
    localStorage.setItem("currentSecurityToken",securityToken);
    localStorage.setItem("currentUserInfo",JSON.stringify(userInfo));
  },
  clearUser: function() {
    if (!this.localStorageIsUsable) {
      return;
    }
    localStorage.removeItem("currentSecurityToken");
    localStorage.removeItem("currentUserInfo");
  },
  getInitialSecurityToken: function() {
    if (!this.localStorageIsUsable) {
      return undefined;
    }
    return localStorage.getItem("currentSecurityToken");
  },
  getInitialUserInfo:function() {
    if (!this.localStorageIsUsable) {
      return undefined;
    }
    var value =localStorage.getItem("currentUserInfo");
    if (value) {
      return JSON.parse(value);
    }
    return value;
  }
};


localStorageManager.initialize();



export default Ember.Service.extend({
  attemptedTransiton: null,
  items: null,
  userInfo: null,

  init() {
    this._super(...arguments);
    
    var securityToken = localStorageManager.getInitialSecurityToken();
    var userInfo = localStorageManager.getInitialUserInfo();

    this.set('securityToken', securityToken);
    this.set('userInfo',userInfo);

    // All communication services will require the security token
    this.updateTokenDependents(securityToken);
  },

  isLoggedIn() {
    var securityToken = this.get('securityToken');
    return securityToken!==null;
  },
  /** Login a user -- implicitly logs out any previously logged in user. */
  login(username,password) {

    //clear out the security token and existing user...
    this.clearUser();

    var _this=this;
    var data = {username: username, password: password};
    var promise =  theDataService.postData(Constants.AUTH_SERVICE,'/authentication/login',{},data).
    then(function(responseInfo) {

      var response = responseInfo.response;
      if (!response.success) {
        return response.message;
      }
      
      var X_AUTH = responseInfo.jqXhr.getResponseHeader("X-AUTH-TOKEN");
      if (!X_AUTH) {
        return "Unable to login... some error has occurred.";
      }

      var securityToken = X_AUTH;
      var userInfo = response.extraData;

      _this.setUser(securityToken,userInfo);
      return null;
    });

    return promise;
  },

  // === USER /SECURITY-TOKEN ====
  updateTokenDependents(token){
    theDataService.setSecurityToken(token);
  },
  clearUser() {
    this.set('securityToken',null);
    this.set('userInfo',null);
    localStorageManager.clearUser();
    this.updateTokenDependents(null);
  },

  setUser(token,userInfo) {
    this.set('securityToken',token);
    this.set('userInfo',userInfo);
    localStorageManager.setUser(token,userInfo);    
    this.updateTokenDependents(token);
  }
});