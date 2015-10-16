import Ember from 'ember';
import whereComponentModel from 'dxref/components/where/where-model';
var logger = log4javascript.getLogger('dxref.controllers.application');

export default  Ember.Controller.extend({
	authenticationService: Ember.inject.service('authentication-service'),
	actions: {
		test: function() {
			this.set('message','this is a test');
		}
	},
	init: function() {
		this._super(...arguments);
		var service = this.get('authenticationService');
		var _this = this;
		service.addObserver('userInfo',function(model,old) {  
		  var userInfo=model.get('userInfo');      		  
		  _this.set('userInfo',userInfo);
		});

		var userInfo = service.get('userInfo');
		this.set('userInfo',userInfo);
	},
	currentPathDidChange: function() {
		var path = this.get('currentPath');
		logger.info('path changed to: ', path); 
		logger.info("WINDOW URL "+window.location);   
		whereComponentModel.set('currentUrl',window.location);
		whereComponentModel.set('currentPath',path);	

		var showChangeUser = path!=='authentication.login';
		this.set('showChangeUser',showChangeUser);	
	}.observes('currentPath')
});