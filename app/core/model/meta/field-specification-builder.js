import { dxrefValidator } from 'dxref/dxref-config';
import { FieldConstants } from 'dxref/core/model/meta/field-types';
import theFieldValidator from 'dxref/core/model/meta/field-validation';
import { DxrefValidationError } from 'dxref/core/errors/dxref-errors';
import { FieldSpecification } from 'dxref/core/model/meta/field-specification';

/** This is a one-time builder, used and thrown away.
	It is used only in conjuction with the ObjectSpecificationBuilder and can
	be considered a helper to that class.
*/
export function FieldSpecificationBuilder(objectSpecificationBuilder, fieldName,type,fieldIsRequired) {
	dxrefValidator
		.throwIfNotObjectMap('objectSpecificationBuilder',objectSpecificationBuilder,true)
		.throwIfNotString('fieldName',fieldName,true)
		.throwIfNotString('type',type,true)
		.throwIfNotBoolean('fieldIsRequired',fieldIsRequired);

	if (!theFieldValidator.isValidFieldType(type)) {
		throw new DxrefValidationError('FieldSpecificationBuilder','Constructor','Type: '+type+' is not recognized');
	}

	var defaultFieldValidator = theFieldValidator.getReasonsValidator(type,true);
	var validationFn = this._makeReasonsValidationFn();
	this.objectSpecificationBuilder = objectSpecificationBuilder;

	//Meta above the field level (e.g. what argument number is this)
	// that we pass back to the object specification builder for assimilation & validation.
	this.fieldMeta = {};

	this.fieldSpecification = new FieldSpecification(fieldName,type,fieldIsRequired,{
		editable: true,
		displayable: this._isDisplayableType(type),
		defaultFieldValidator: defaultFieldValidator,
		_getReasonsNotValidFn: validationFn

	});
}

FieldSpecificationBuilder.prototype.argNum=function(argNum) {

	dxrefValidator.throwIfNotNumber(argNum);
	if (argNum<0 || argNum>8) {
		throw new DxrefValidationError('FieldSpecificationBuilder','argNum','Arg is outside 0-8 >> '+argNum);
	}
	if (this.fieldMeta.argNum) {
		throw new DxrefValidationError('FieldSpecificationBuilder','argNum','ArgNum was already defined!');
	}

	this.fieldMeta.argNum = argNum;
	return this;
};

FieldSpecificationBuilder.prototype.defaultValue=function(value) {
	this.fieldSpecification.defaultValue = value;
	return this;
};

FieldSpecificationBuilder.prototype.editable=function(value) {
	dxrefValidator.throwIfNotBoolean('value',value);
	if (value===undefined) { value = true; }
	this.fieldSpecification.editable = value;
	return this;
};

FieldSpecificationBuilder.prototype.displayable=function(value) {
	dxrefValidator.throwIfNotBoolean('value',value);
	if (value===undefined) { value = true; }
	this.fieldSpecification.displayable = value;
	return this;
};

FieldSpecificationBuilder.prototype.collectionElementType=function(type) {
	//Functions are future...
	dxrefValidator.throwIfNotString(type);
	if (!theFieldValidator.isValidFieldType(type)) {
		throw new DxrefValidationError('FieldSpecificationBuilder','collectionElementType','Invalid field type: '+type);
	}
	this.fieldSpecification.collectionElementType = type;
	return this;
};


FieldSpecificationBuilder.prototype.choices=function(openSet, choicesArray) {
	dxrefValidator.throwIfNotBoolean('openClosed',openSet,true)
		.throwIfNotArray('choicesArray',choicesArray,true);

	this.fieldSpecification.choices = {
		values: choicesArray,
		openclosed: openSet
	};

	return this;
};


FieldSpecificationBuilder.prototype.completeFieldSpec=function() {

	this.objectSpecificationBuilder._registerField(this,this.fieldSpecification, this.fieldMeta);

	return this.objectSpecificationBuilder;
};

/* ==================================================================
	PRIVATE METHODS
   =============================================================== */
FieldSpecificationBuilder.prototype._isDisplayableType=function(type) {
	return type!==FieldConstants.Type.ID;
};

FieldSpecificationBuilder.prototype._makeReasonsValidationFn=function() {

	return function(fieldName,value,required,fieldSpec,objectContext,generalContext) {
		if (fieldSpec.validators) {
			for (var i=0; i<fieldSpec.validators.length; i++) {
				var validator = fieldSpec.validators[i];
				var reasonsNotValid = validator(fieldName,value,required,fieldSpec,objectContext,generalContext);
				if (reasonsNotValid.length!==0) {
					return reasonsNotValid;
				}
			}
			return [];
		}
		//Otherwise use the default validator if it exists...
		if (fieldSpec.defaultFieldValidator) {
			return fieldSpec.defaultFieldValidator(fieldName,value,required,fieldSpec,objectContext,generalContext);
		}

		//Otherwise we're fine.
		return [];
	};
};


