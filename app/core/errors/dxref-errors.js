import { dxrefValidator } from 'dxref/dxref-config';

export function DxrefError(className,functionName,msg) {

	dxrefValidator.throwIfNotString(className)
		.throwIfNotString(functionName)
		.throwIfNotString(msg);
		
	this.className = className;
	this.functionName = functionName;
	this.msg = msg;
}

export function DxrefValidationError(className,functionName,msg) {
	this.parent.constructor.call(this,className,functionName,msg);	
}

DxrefValidationError.prototype = new DxrefError();
DxrefValidationError.prototype.constructor = DxrefValidationError;
DxrefValidationError.prototype.parent = DxrefError.prototype;

export function DxrefMultiValidationError(className,functionName,array) {
	var msg = 'There were '+array.length+' validation errors!';
	if (array.length===1) {
		msg = array[0];
	}

	this.parent.constructor.call(this,className,functionName,msg);
	this.errors = array;
}

DxrefMultiValidationError.prototype = new DxrefValidationError();
DxrefMultiValidationError.prototype.constructor = DxrefMultiValidationError;
DxrefMultiValidationError.prototype.parent = DxrefValidationError.prototype;
