import dxrefConfig from 'dxref/dxrefConfig';
import DS from 'ember-data';
import Ember from 'ember';


var claimPromiseMap = {};
export default DS.RESTAdapter.extend({
	poll: function() {

	},
	registerClaimable: function(claimInfo,promise) {
		claimPromiseMap[claimInfo.claimid]=promise;
	},
   	find: function(claimInfo) {
		console.log("Invoked with: "+JSON.stringify(claimInfo));

		//return Ember.$.getJSON('http://localhost:8080/content/getRandom')
		return Ember.$.getJSON(dxrefConfig.getUrl('dxref-service','/dev/claimTicket',claimInfo.claimId))
					.then(function(data) {			
				console.log("DATA>> ");
				console.dir(data);				
				return data;
			});						
	}
});