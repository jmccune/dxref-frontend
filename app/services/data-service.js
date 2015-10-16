import Ember from 'ember';
import dxrefConfig from 'dxref/dxref-config';
import DxrefError from 'dxref/dxref-errors';

var logger = log4javascript.getLogger('dxref.services.data-service');


var local = {
	securityToken: null,
	getHeaders: function() {		
		var headers = {};				
		if (local.securityToken) {
			headers['x-auth-token']=local.securityToken;
		}		
		return headers;
	},
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


var DataServiceEObj = Ember.Object.extend({
	authenticationService: Ember.inject.service('authentication-service'),
	getServiceEndpoint(serviceName) {
		var result = dxrefConfig.serverMap[serviceName];
		if (!result) {
			throw "Unable to find endpoint target: "+serviceName;
		}	
		return result;	
	},
	buildUrl(serviceName,path,params) {
		var hostTarget = this.getServiceEndpoint(serviceName);
		var refinedPath = local.getRefinedPath(path);
		var refinedParams = local.getRefinedParams(params);
		return hostTarget+refinedPath+refinedParams;
	},
	getData(serviceName,path,params) {
		var url = this.buildUrl(serviceName,path,params);				
		var headers = local.getHeaders();
		
		logger.info("REQUESTING DATA from: "+url);
		return Ember.$.ajax({
			dataType: 'json',
			url:url,
			headers: headers
		}).then(function(response) {
			logger.info("RESPONSE RECEIVED for request: "+url);
			if (logger.isDebugEnabled()) {			
				console.dir(response);
			}
			return response;
		});
	},
	postData(serviceName,path,params,data) {

		var url = this.buildUrl(serviceName,path,params,data);		
		var headers = local.getHeaders();

		logger.info("POSTING DATA TO: "+url);

		return Ember.$.ajax({
	  		type: "POST",
	  		url: url,
	  		data: data,
	  		success: null,
	  		dataType: 'json',
	  		headers: headers  		
		}).then(function(response,status,jqXhr) {
			logger.info("RESPONSE RECEIVED for request: "+url);
			if (logger.isDebugEnabled()) {			
				console.dir(response);
				console.dir(status);
				console.dir(jqXhr);
			}
			return { 
				response : response,
				status: status,
				jqXhr: jqXhr
			};
		});
	},
	simulateDelayedResponse(timeout, response) {
		if (typeof timeout === 'undefined') {
			timeout = 1000;
		}

		if (typeof response === 'undefined') {
			response = {};
		}

		var resolveFn = null;
	  	var promise =  new Ember.RSVP.Promise(function(resolve /*,reject*/) {
	  		resolveFn = resolve;
	  	});

	  	setTimeout(function(){
	  		console.log("*** Simulated Delay Response >> TIMEOUT WENT! Will return ");
	  		console.dir(response);
	  		resolveFn(response);
	  	},timeout);

	    return promise;
	},
	setSecurityToken(token) {
		local.securityToken = token;
	}
});

var theDataService = DataServiceEObj.create();
export default theDataService;