import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/core/model/meta/field-utils';
import { FieldSpecificationBuilder } from 'dxref/core/model/meta/field-specification-builder';
import { ObjectSpecification } from 'dxref/core/model/meta/object-specification';

import { DxrefError, DxrefValidationError } from 'dxref/core/errors/dxref-errors';


export function ObjectSpecificationBuilder() {
	this._init();

	//Temporarily remove warnings...
	dxrefValidator.throwIfNotString('abc');
	theFieldUtils.isValidFieldType('_f_Any');
}

ObjectSpecificationBuilder.prototype._init=function() {
	this.fieldSpecificationBuilder = null;

	this.specification = new ObjectSpecification();
	
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


/**
@param fieldMeta is meta about the field that is outside the context of that field alone--
for instance what argument number should this field be? Which can only be validated in the
object specification against the other fields. */
ObjectSpecificationBuilder.prototype._registerField=function(fsb, fieldSpecification, fieldMeta) {
	dxrefValidator
		.throwIfNotString('fieldName',fieldSpecification.fieldName,true)
		.throwIfNotString('type',fieldSpecification.type,true)
		.throwIfNotFunction('_validationFn',fieldSpecification._validationFn,true)
		.throwIfNotBoolean('required',fieldSpecification.required);

	if (this.fieldSpecificationBuilder!==fsb) {
		throw new DxrefError('ObjectSpecificationBuilder','_registerField','Unexpected field specification builder');
	}


	var fieldName = fieldSpecification.fieldName;	

	if (_.contains(_.keys(this.specification),fieldName)) {
		throw new DxrefValidationError('ObjectSpecificationBuilder','_processFieldMeta','already contains field: '+fieldName);
	}
	
	this.specification[fieldName] = fieldSpecification;
	this._processFieldMeta(fieldName, fieldSpecification, fieldMeta);

	if (fieldSpecification.required) {
		this.specification._meta.requiredFields.push(fieldName);
	}

	//DONE/COMPLETED...
	this.fieldSpecificationBuilder = null;
};


ObjectSpecificationBuilder.prototype._processFieldMeta=function(fieldName, fieldSpecification, fieldMeta) {

	/** Argument Ordering **/
	var argNum = fieldMeta.argNum;
	var _meta = this.specification._meta;

	if (argNum || argNum===0) {	

		if (!_meta.argumentOrder) {
			_meta.argumentOrder = [];
		}

		if (_meta.argumentOrder.length!==argNum) {
			throw new DxrefValidationError('ObjectSpecificationBuilder','_processFieldMeta',
				'Field: '+fieldName + 
				' is out of order -- expected argument number: '+_meta.argumentOrder.length+ ' not '+argNum);
		}

		_meta.argumentOrder.push(fieldName);
	}

	if (fieldSpecification.defaultValue!==undefined && 
		!_.contains(_meta.defaultValueFields,fieldName)) {
		_meta.defaultValueFields.push(fieldName);

	} 
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