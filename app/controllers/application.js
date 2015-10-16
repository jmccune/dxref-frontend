import Ember from 'ember';
import whereComponentModel from 'dxref/components/where/where-model';

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
	},
	currentPathDidChange: function() {
		var path = this.get('currentPath');
		console.log('path changed to: ', path); 
		console.log("WINDOW URL "+window.location);   
		whereComponentModel.set('currentUrl',window.location);
		whereComponentModel.set('currentPath',path);
	}.observes('currentPath')
});