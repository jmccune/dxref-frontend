import dxrefConfig from 'dxref/dxref-config';
import DS from 'ember-data';
import Ember from 'ember';
import theDataService from 'dxref/services/data-service';

var claimPromiseMap = {};

function processResponse(responseMap) {

	_.forEach(responseMap,function(value, key) {

		var resolveRejectObject = claimPromiseMap[key];
		if (!resolveRejectObject) {
			//Assume we already resolved it and return.
			// (e.g. 2 requests out and both return valid responses,
			// the first one will clear out the resolveRejectObject and we're done--
			// so this condition represents the second time and we don't
			// have any promise to update.)
			return;
		}

		delete claimPromiseMap[key];

		resolveRejectObject.resolve(value);


	});
}



var ClaimService= DS.RESTAdapter.extend({
	pollableFunction: function() {		
		var keys = _.keys(claimPromiseMap);		
		if (keys.length===0) {
			//Nothing to ask about...
			return;
		}
				
		theDataService.getData('dxref-service','/dev/claimTickets',{ tickets: keys}).
			then(function(response) {
				processResponse(response);
			});

	},
	registerClaimable: function(claimInfo,resolveRejectObject) {
		claimPromiseMap[claimInfo.claimId]=resolveRejectObject;
	},
   	find: function(claimInfo) {
		console.log("Invoked with: "+JSON.stringify(claimInfo));

		//return Ember.$.getJSON('http://localhost:8080/content/getRandom')
		return Ember.$.getJSON(dxrefConfig.getUrl('dxref-service','/dev/claimTicket',claimInfo.claimId))
					.then(function(data) {							
				return data;
			});						
	}
});

var claimService = new ClaimService();
export default claimService;