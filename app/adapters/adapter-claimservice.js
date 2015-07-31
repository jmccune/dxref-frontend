import dxrefConfig from 'dxref/dxrefconfig';
import DS from 'ember-data';
import Ember from 'ember';

var claimPromiseMap = {};

var ClaimService= DS.RESTAdapter.extend({
	pollableFunction: function() {
		
		
		var keys = _.keys(claimPromiseMap);		
		if (keys.length===0) {
			//Nothing to ask about...
			return;
		}

		//Otherwise ask about the ticket(s)
		var params='';
		_.forEach(keys,function(key) {
			params = params+"&tickets="+key;
		})
		params=params.replace("&","");

		


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

var claimService = new ClaimService();
export default claimService;