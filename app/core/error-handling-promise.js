export function ErrorHandlingPromise(actualPromise, rootErrorHandlingPromise, previousErrorHandlingPromise) {
	this.actualPromise = actualPromise;
	if (rootErrorHandlingPromise!==undefined) {
		this.rootErrorHandlingPromise = rootErrorHandlingPromise;
	} else {
		this.rootErrorHandlingPromise = this;
	}
	this.defaultCatchInfo = null;
	this.catchInfo = null;	
	this.previousErrorHandlingPromise = previousErrorHandlingPromise;

	// Assume until the next (then/finally) call that we are a terminal
	this.isTerminal = true;
}


ErrorHandlingPromise.prototype.then=function(successFn,rejectFn,label) {
	var _this = this;
	var newPromise = this.actualPromise.then(successFn,rejectFn,label).catch(function(val) {
		return _this._catchProxyCall(val);
	},label);

	if (rejectFn && this.previousErrorHandlingPromise) {
		this.previousErrorHandlingPromise.isTerminal =false;
	}

	return new ErrorHandlingPromise(newPromise,this.rootErrorHandlingPromise, this);
};

ErrorHandlingPromise.prototype.catch=function(rejectFn,label) {
	this.previousErrorHandlingPromise._setUserDefinedCatchCall(rejectFn,label);
	return this;
};

ErrorHandlingPromise.prototype.finally=function(finallyFn,label) {
	var _this = this;
	var newPromise = this.actualPromise.finally(finallyFn,label).catch(function(val) {
		return _this._catchProxyCall(val);
	},label);

	return new ErrorHandlingPromise(newPromise,this.rootErrorHandlingPromise, this);
};

ErrorHandlingPromise.prototype.setDefaultCatch=function(rejectFn,label) {
	this.rootErrorHandlingPromise.defaultCatchInfo = {
		rejectFn: rejectFn,
		label: label
	};
};

ErrorHandlingPromise.prototype._setUserDefinedCatchCall=function(rejectFn,label) {
	this.catchInfo = {
		rejectFn: rejectFn,
		label: label
	};
};

ErrorHandlingPromise.prototype._catchProxyCall=function(value) {
	//console.log("**** CATCHING PROXY CALL: "+value+ " has catchInfo? "+this.catchInfo);
	if (this.catchInfo) {
	//	console.log("LOCAL CATCH");
		return this.catchInfo.rejectFn(value,this.catchInfo.label);
	}
	if (this.isTerminal && this.rootErrorHandlingPromise.defaultCatchInfo) {
	//	console.log("DEFAULT CATCH");
		var catchInfo = this.rootErrorHandlingPromise.defaultCatchInfo;
		return catchInfo.rejectFn(value,catchInfo.label);
	}
	//console.log("NO CATCH");
	throw value;
};
