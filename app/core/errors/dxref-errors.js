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