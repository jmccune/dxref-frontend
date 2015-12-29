import { DxrefError } from 'dxref/core/errors/dxref-error';

export function DxrefValidationError(className,functionName,msg) {
	this.parent.constructor.call(this,className,functionName,msg);	
}

DxrefValidationError.prototype = new DxrefError();
DxrefValidationError.prototype.constructor = DxrefValidationError;
DxrefValidationError.prototype.parent = DxrefError.prototype;