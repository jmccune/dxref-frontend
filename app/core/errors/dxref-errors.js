import { dxrefValidator } from 'dxref/dxref-config';

export function DxrefError(className,functionName,msg) {

	dxrefValidator.throwIfNotString(className)
		.throwIfNotString(functionName)
		.throwIfNotString(msg);
		
	this.className = className;
	this.functionName = functionName;
	this.msg = msg;	
}


DxrefError.prototype.getFullErrorMessage=function() {
	return this.className+"#"+this.functionName+">>"+this.msg;
};


/** =================================================================
	DxrefValidationError CLASS
    ================================================================= */
export function DxrefValidationError(className,functionName,msg) {
	DxrefError.call(this,className,functionName,msg);	
}

DxrefValidationError.prototype = Object.create(DxrefError.prototype);
DxrefValidationError.prototype.constructor = DxrefValidationError;


/** =================================================================
	DxrefMultiValidationError CLASS
    ================================================================= */

export function DxrefMultiValidationError(className,functionName,array) {
	var msg = 'There were '+array.length+' validation errors!';
	if (array.length===1) {
		msg = array[0];
	}

	DxrefValidationError.call(this,className,functionName,msg);	
	this.errors = array;
}

DxrefMultiValidationError.prototype = Object.create(DxrefValidationError.prototype);
DxrefMultiValidationError.prototype.constructor = DxrefMultiValidationError;

DxrefMultiValidationError.prototype.getFullErrorMessage=function() {
	var msg = this.className+"#"+this.functionName+">> "+this.errors.length+" errors encountered";
	msg+= '\n\t'+this.errors.join('\n\t');
	return msg;
};