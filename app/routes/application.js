import Ember from 'ember';
import claimService from 'dxref/adapters/adapter-claimservice';
import pollingService from 'dxref/services/polling-service';

var dynamic_user = false;

function appInit() {
  console.log("Dxref Initialization Starting...");
  pollingService.addPollable('claimService',claimService.pollableFunction);
  pollingService.poll();
  console.log("Dxref Initialization COMPLETE!");
}


appInit();

export default Ember.Route.extend({

  // authenticationService: Ember.inject.service('authentication-service'),
  // init: function() {
  //   this._super(...arguments);
  //   var service = this.get('authenticationService');
  //   var _this = this;
  //   service.addObserver('userInfo',function(model,old) {  
  //     console.log("*** OBSERVED");        
  //     var userInfo=model.get('userInfo');      
  //     console.dir(userInfo);
  //     _this.set('userInfo',userInfo);
  //   });

  //   _this.set('userInfo', { username: 'xyz'});
  // },
  model: function() {
    return {userInfo : {username: 'xyz'}};
  }
});
