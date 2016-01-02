export function ErrorHandlingPromise(actualPromise, rootErrorHandlingPromise, previousErrorHandlingPromise) {
	this.actualPromise = actualPromise;
	if (rootErrorHandlingPromise!==undefined) {
		this.rootErrorHandlingPromise = rootErrorHandlingPromise;
	} else {
		this.rootErrorHandlingPromise = this;
	}
	this.catchFn = null;
	this.caughtPromise = null;
	this.previousErrorHandlingPromise = previousErrorHandlingPromise;
}


ErrorHandlingPromise.prototype.then=function(successFn,rejectFn,label) {
	var _this = this;
	var newPromise = this.actualPromise.then(successFn,rejectFn,label).catch(function(val) {
		return _this.catchProxyCall(val);
	},label);
	return new ErrorHandlingPromise(newPromise,this.rootErrorHandlingPromise, this);

};

ErrorHandlingPromise.prototype.catch=function(rejectFn,label) {
	var _this = this;
	var newPromise = this.actualPromise.catch(function(val) {
		return _this.catchProxyCall(val);
	},label);
	return new ErrorHandlingPromise(newPromise,this.rootErrorHandlingPromise);
};

ErrorHandlingPromise.prototype.finally=function(rejectFn,label) {
	console.log("FINALLY: "+rejectFn+" "+label);
};

ErrorHandlingPromise.prototype.defaultCatch=function(rejectFn,label) {
	console.log("FINALLY: "+rejectFn+" "+label);
};

ErrorHandlingPromise.prototype.catchProxyCall=function(value) {
	throw value;
};
