import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/utils/field-types';
import { DxrefValidationError } from 'dxref/core/errors/dxref-errors';

/** This is a one-time builder, used and thrown away. */
export function FieldSpecificationBuilder(objectSpecificationBuilder, fieldName,type,fieldIsRequired) {
	dxrefValidator
		.throwIfNotObjectMap('objectSpecificationBuilder',objectSpecificationBuilder,true)
		.throwIfNotString('fieldName',fieldName,true)
		.throwIfNotString('type',type,true)
		.throwIfNotBoolean('fieldIsRequired',fieldIsRequired);

	if (!theFieldUtils.isValidFieldType(type)) {
		throw new DxrefValidationError('FieldSpecificationBuilder','Constructor','Type: '+type+' is not recognized');
	}

	var defaultFieldValidator = theFieldUtils.getValidator(type,true);
	var validationFn = this._getValidationFn();
	this.objectSpecificationBuilder = objectSpecificationBuilder;
	
	//Meta above the field level (e.g. what argument number is this)
	// that we pass back to the object specification builder for assimilation & validation.
	this.fieldMeta = {};

	this.fieldSpecification = {		
		fieldName: fieldName,
		type: type,		
		required: fieldIsRequired,
		defaultFieldValidator: defaultFieldValidator,
		_validationFn: validationFn,
		
		// -- let's not make this explicit unless we need it...
		// editable: true,
		// displayable: true
	};


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



FieldSpecificationBuilder.prototype._getValidationFn=function() {

	return function(fieldName,value,required,fieldSpec,objectContext,generalContext) {
		if (fieldSpec.validators) {
			for (var i=0; i<fieldSpec.validators.length; i++) {
				var validator = fieldSpec.validators[i];			
				var checkValidationResult = validator(fieldName,value,required,fieldSpec,objectContext,generalContext);
				if (checkValidationResult!==true) {
					return checkValidationResult;
				}
			}
			return true;
		}
		//Otherwise use the default validator if it exists...
		if (fieldSpec.defaultFieldValidator) {
			return fieldSpec.defaultFieldValidator(fieldName,value,required,fieldSpec,objectContext,generalContext);
		}

		//Otherwise we're fine.
		return true;
	};
};


FieldSpecificationBuilder.prototype.completeFieldSpec=function() {

	this.objectSpecificationBuilder._registerField(this,this.fieldSpecification, this.fieldMeta);	

	return this.objectSpecificationBuilder;
};