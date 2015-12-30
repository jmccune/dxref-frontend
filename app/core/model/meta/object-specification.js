
import { dxrefValidator } from 'dxref/dxref-config';
import { DxrefError, DxrefMultiValidationError} from 'dxref/core/errors/dxref-errors';

/**  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	See _object-spec.md for documentation 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

export function ObjectSpecification() {
	this._meta= {
		requiredFields: [],
		defaultValueFields: [],
		doValidation: true
	};
}

ObjectSpecification.prototype.getRequiredFields=function() {
	return this._meta.requiredFields;
};


ObjectSpecification.prototype.validateThisSpecification=function() {
	/** TBD:  Validates that the required fields are consistent,
		that fields have the expected/required fields, etc. */
};


/** Processes the given arguments into a data map based on argument
    ordering-- assuming it exists.   Default values are used and given
    to attributes that have defaults but those were not specified.

    The last argument can/should be an option map that specifies whether
*/
ObjectSpecification.prototype.convertToDataMap=function() {

	if (!this._meta.argumentOrder) {
		if (arguments.length!==1) {
			throw new DxrefError('ObjectSpecification','convertToDataMap','No ordered arguments given!');
		}
		this._meta.argumentOrder=[];
	}

	if (arguments.length > this._meta.argumentOrder.length+1) {
		throw new DxrefError('ObjectSpecification','convertToDataMap',
			'Too many ('+arguments.length+')arguments given >> max of: '+(this._meta.argumentOrder.length+1)+'allowed');
	}

	// Convert from direct argument...
	var givenArguments = arguments;
	var dataMap = {};
	for (var i=0; i<givenArguments.length; i++) {
		var fieldName = this._meta.argumentOrder[i];
		var value = givenArguments[i];	
		if (i===(givenArguments.length-1) && _.isObject(value)) {
			dataMap = _.merge(dataMap, value);
		}  else {
			dataMap[fieldName] = value;
		}
	}

	dataMap = this.addDefaultsToData(dataMap);

	return dataMap;
};

ObjectSpecification.prototype.addDefaultsToData=function(dataMap) {
	//Enrich with defaults...
	var specification = this;
	if (this._meta.defaultValueFields) {
		this._meta.defaultValueFields.forEach(function(fieldName) {
			if (dataMap.hasOwnProperty(fieldName)) {
				return;
			}
			dataMap[fieldName] = specification[fieldName].defaultValue;
		});
	}
	return dataMap;
};


ObjectSpecification.prototype.getReasonsDataNotValid=function(data,context) {
	dxrefValidator.throwIfNotObjectMap(data);

	// Skip validation if it's disabled for some reason.
	if (this._meta.doValidation===false) {
		return [];
	}

	// ESTABLISH REQUIRED FIELDS
	var dataFieldNames = _.keys(data);
	var missingRequiredFields = _.difference(this._meta.requiredFields,dataFieldNames);
	if (missingRequiredFields.length>0) {
		var msg = 'Missing *required* fields: '+missingRequiredFields.join();
		return [msg];
	}

	//ensure a default context...
	if (!context) { 
		context = {};
	}
	// VALIDATED FIELDS
	var specification = this;	
	var fieldValidationErrors=[];
	dataFieldNames.forEach(function(fieldName) {
		

		var fieldSpec = specification[fieldName];
		var fieldValue = data[fieldName];
		var isRequired = fieldSpec.required;				
		var result = fieldSpec._validationFn(fieldName,fieldValue,isRequired,fieldSpec,data,context);

		console.log("CHECKING FIELD: "+fieldName+" VALUE: "+fieldValue+" >> RESULT: "+result);

		if (result!==true) {
			if (dxrefValidator.isString(result)) {
				fieldValidationErrors.push('FieldValidationError('+fieldName+')>'+result);
			} else {
				fieldValidationErrors.push('FieldValidationError('+fieldName+')> did not validate!!');
			}
		}
	});

	if (fieldValidationErrors.length>0) {
		return fieldValidationErrors;				
	}

	return []; 
};

ObjectSpecification.prototype.throwIfNotValidData=function(data) {
	var reasons = this.getReasonsDataNotValid(data);
	if (reasons.length>0) {
		throw new DxrefMultiValidationError('ObjectSpecification','throwIfNotValidData',reasons);
	}
};