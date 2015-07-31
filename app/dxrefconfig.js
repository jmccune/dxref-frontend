/** 
	See Overall Config at the bottom of the file.
*/

/** gets the application url */
function getUrlFunction(target, path, params) {

	// Ignore target for now.  The target is always the development url.

	if (path.indexOf('/')!==0) {
		path = '/'+path;
	}
	if (params) {
		var type = typeof params;
		if (type === 'string') {
			if (params.indexOf('?')!==0) {
				params = '?'+params;
			}
		}	
		else {
			throw "NOT YET SUPPORTED: type>> "+type+" for params in dxrefConfig.getUrl";
		}
	}
	else {
		params ='';
	}		
	return dxrefConfig.serverUrl+path+params;
}





/** ============= THE OVERALL CONFIG OBJECT ======================*/
var dxrefConfig= {

	pollingDelayMs: 1000,   
	serverMap: {
		'dxref-service': 'http://localhost:8080'
	}	
};

export default dxrefConfig;