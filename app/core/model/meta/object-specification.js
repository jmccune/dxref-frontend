
import { dxrefValidator } from 'dxref/dxref-config';
import { DxrefError, DxrefMultiValidationError} from 'dxref/core/errors/dxref-errors';

var logger = log4javascript.getLogger("dxref/core/model/meta/object-specification");


/**  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	See _object-spec.md for documentation 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

export function ObjectSpecification(name) {
	dxrefValidator.throwIfNotString('name (of ObjectSpecification)',name,true,true);			
	this._specMeta = {
		name: name,
		invalidationWarningMessageCount: 0
	};

	this._meta= {	
		requiredFields: [],
		defaultValueFields: [],
		doValidation: true,
		allowUnspecfiedFields: true
	};	
}



ObjectSpecification.prototype.getRequiredFields=function() {
	return this._meta.requiredFields;
};

ObjectSpecification.prototype.getFields=function() {
	var fields = _.filter(_.keys(this),function(x) { return x!=='_meta';});
	return fields;
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



ObjectSpecification.prototype.getReasonsDataNotValid=function(dataName, data,context) {
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
		if (!fieldSpec) {
			if (specification._meta.allowUnspecfiedFields) {
				return;
			}	
			else {
				fieldValidationErrors.push('Cannot validate the field missing from the ObjectSpecification> '+fieldName);
				return;
			}
		} 
		var fieldValue = data[fieldName];
		var isRequired = fieldSpec.required;				
		var reasonsNotValid = fieldSpec._getReasonsNotValidFn(fieldName,fieldValue,isRequired,fieldSpec,data,context);

		logger.debug("CHECKING FIELD: "+fieldName+" VALUE: "+fieldValue+" >> RESULT: "+reasonsNotValid.length);
		Array.prototype.push.apply(fieldValidationErrors, reasonsNotValid);
		
	});

	if (logger.isWarnEnabled() && fieldValidationErrors.length>0) {
		var num =specification._specMeta.invalidationWarningMessageCount++;
		var name=specification._specMeta.name;
		var msgNum=0;		
		logger.warn('Specification('+name+') Warn# '+num+':> had problems validating data for a data object> '+dataName);
		fieldValidationErrors.forEach(function(reason) {
			logger.warn('   Warn# '+num+'_'+msgNum+':> '+reason);
			msgNum++;				
		});

	}

	return fieldValidationErrors;				
};

ObjectSpecification.prototype.throwIfNotValidData=function(data) {
	var reasons = this.getReasonsDataNotValid('ObjectSpecification#throwIfNotValidData',data);
	if (reasons.length>0) {
		throw new DxrefMultiValidationError('ObjectSpecification','throwIfNotValidData',reasons);
	}
};