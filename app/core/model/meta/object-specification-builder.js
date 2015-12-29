import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/core/model/meta/field-utils';
import { FieldSpecificationBuilder } from 'dxref/core/model/meta/field-specification-builder';
import { DxrefError } from 'dxref/core/errors/dxref-error';

export function ObjectSpecificationBuilder() {
	this._init();

	//Temporarily remove warnings...
	dxrefValidator.throwIfNotString('abc');
	theFieldUtils.isValidFieldType('_f_Any');
}

ObjectSpecificationBuilder.prototype._init=function() {
	this.specification = {
		_meta: {
			requiredFields:[]
		}
	};
	this.fieldSpecificationBuilder = null;

};

ObjectSpecificationBuilder.prototype.addField=function(name,type,required) {

	this._completeCurrentFieldBuilding();

	//Add/create new field builder...
	this.fieldSpecificationBuilder=new FieldSpecificationBuilder(this, name,type,required);

	// Ensure that it knows how to transition back to this object at the appropriate times.
	this._addTransitions(this.fieldSpecificationBuilder);

	return this.fieldSpecificationBuilder;
};

ObjectSpecificationBuilder.prototype.completeObjectSpec=function() {

	this._completeCurrentFieldBuilding();
	var result = this.specification;
	this._init();
	return result;
};



ObjectSpecificationBuilder.prototype._completeCurrentFieldBuilding=function() {
	if (this.fieldSpecificationBuilder) {
		this.fieldSpecificationBuilder.completeFieldSpec();
	}
};


ObjectSpecificationBuilder.prototype._registerField=function(fsb, fieldSpecification) {
	dxrefValidator
		.throwIfNotString('fieldName',fieldSpecification.fieldName,true)
		.throwIfNotString('type',fieldSpecification.type,true)
		.throwIfNotFunction('_validationFn',fieldSpecification._validationFn,true)
		.throwIfNotBoolean('required',fieldSpecification.required);

	if (this.fieldSpecificationBuilder!==fsb) {
		throw new DxrefError('ObjectSpecificationBuilder','_registerField','Unexpected field specification builder');
	}

	var fieldName = fieldSpecification.fieldName;	
	this.specification[fieldName] = fieldSpecification;

	if (fieldSpecification.required) {
		this.specification._meta.requiredFields.push(fieldName);
	}

	//DONE/COMPLETED...
	this.fieldSpecificationBuilder = null;
};

ObjectSpecificationBuilder.prototype._addTransitions=function(obj) {

	var transitionsBackToThisObject =['addField','completeObjectSpec'];
	var _this = this;
	transitionsBackToThisObject.forEach(function(fnName) {
		obj[fnName] = function() {
			return _this[fnName].apply(_this,arguments);
		};
	});	
};