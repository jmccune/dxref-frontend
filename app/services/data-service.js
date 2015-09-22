import Ember from 'ember';
import dxrefConfig from 'dxref/dxref-config';
import DxrefError from 'dxref/dxref-errors';


var logger = log4javascript.getLogger('dxref.services.data-service');

export function DataService() {
}


var local = {
	prependIfNotPresent:function(string,character) {
		if (string.indexOf(character)!==0) {
			string = character + string;
		}				
		return string;	
	},
	getRefinedPath : function(path) {
		if (!path) {
			path = '';
		}
		path = local.prependIfNotPresent(path,"/");
		return path;
	},
	getRefinedParams : function(params) {
		if (!params) {			
			return '';
		}
		
		var type = typeof params;
		if (type==='string') {
			//Do nothing... done-- pre-built.
		}
		if (type==='object') {
			var paramsString = '';
			_.forEach(params,function(v,k) {
				if (_.isArray(v)) {
					_.forEach(v,function(v2) {
						paramsString = paramsString + '&' + k + '=' + v2;
					});
				} else if (_.isObject(v)) {
					throw new DxrefError("Object arguments not supported!");
				} else {
					paramsString = paramsString + '&' + k + '=' + v;
				}
			});

			// Replace the params object with the string to use.
			params = paramsString.replace("&","?");
		}


		if (params.length>0)
		{
			params = local.prependIfNotPresent(params,"?");	
		}
		return params;
	}
};


DataService.prototype.getServiceEndpoint=function(serviceName) {

	var result = dxrefConfig.serverMap[serviceName];
	if (!result) {
		throw "Unable to find endpoint target: "+serviceName;
	}	
	return result;
};



DataService.prototype.buildUrl = function(serviceName,path,params) {
	var hostTarget = this.getServiceEndpoint(serviceName);
	var refinedPath = local.getRefinedPath(path);
	var refinedParams = local.getRefinedParams(params);
	return hostTarget+refinedPath+refinedParams;
};

DataService.prototype.getData = function(serviceName,path,params) {

	var url = this.buildUrl(serviceName,path,params);
	logger.info("REQUESTING DATA from: "+url);
	return Ember.$.getJSON(url).then(function(response) {
		logger.info("RESPONSE RECEIVED for request: "+url);
		if (logger.isDebugEnabled()) {			
			console.dir(response);
		}
		return response;
	});
									
};

DataService.prototype.convertToTypedCollection=function(type,collection) {
	if (!_.isArray(collection)) {
		throw "doesn't support map types yet!?";
	}

	var result = [];
	_.forEach(collection,function(itemJson) {	
	//** WORKING HERE **	
	});
}



var theDataService = new DataService();

export default theDataService;