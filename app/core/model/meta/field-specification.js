import { dxrefValidator } from 'dxref/dxref-config';

export function FieldSpecification(fieldName,type, isRequired, object) {
	dxrefValidator
		.throwIfNotString('fieldName',fieldName,true)
		.throwIfNotString('type',type,true)
		.throwIfNotBoolean('isRequired',isRequired);

	_.merge(this,object);
	this.fieldName = fieldName;
	this.type = type;
	this.required= isRequired;
}

FieldSpecification.prototype.getFieldName=function() {
	return this.fieldName;
};

FieldSpecification.prototype.getType=function() {
	return this.type;
};

FieldSpecification.prototype.isRequired=function() {
	return this.required;
};