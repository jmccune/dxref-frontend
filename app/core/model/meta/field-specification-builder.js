import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/utils/field-types';
import { DxrefValidationError } from 'dxref/core/errors/dxref-validation-error';

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

	this.objectSpecificationBuilder._registerField(this,this.fieldSpecification);	

	return this.objectSpecificationBuilder;
};