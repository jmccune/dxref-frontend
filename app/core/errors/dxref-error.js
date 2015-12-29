import { dxrefValidator } from 'dxref/dxref-config';

export function DxrefError(className,functionName,msg) {

	dxrefValidator.throwIfNotString(className)
		.throwIfNotString(functionName)
		.throwIfNotString(msg);
		
	this.className = className;
	this.functionName = functionName;
	this.msg = msg;
}