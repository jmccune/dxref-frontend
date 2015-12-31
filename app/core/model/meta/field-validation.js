import { dxrefValidator } from 'dxref/dxref-config';
import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { DxrefMultiValidationError} from 'dxref/core/errors/dxref-errors';
/***

Validation takes 3 forms:

	1.   isValid()   			--   returns True/False  for decisions by 3rd party
	2.   getReasonsNotValid()	--   returns a list of strings describing the problem
									 (or empty for no problem)
	3.   throwIfNotValid()		--   throw an exception (with the reason) if there is a problem.									 

	DESIGN:

	* obviously getting the reasons is the most difficult part of this.
	  so implementations will always return the reason.
	* #1 & #3 will be derived from #2. 


	AT THE SIMPLEST, ALL VALIDATION FUNCTIONS will take at least 3 arguments.

	(is/getReasonNot/throwIfNot)Valid(<fieldName>, <fieldValue>, <isRequired>)

*/



/** Simple types & primitives likely directly validate against the js-validator
    library.  More complext types are defined below, but simpler ones are defined
    here and then built. */
var directValidatorMap={	
	'String': 'isString',
	'List'  : 'isArray',
	'Number': 'isNumber',
	'Boolean': 'isBoolean',
	'Function': 'isFunction',
	'Object'  : 'isObjectMap',
	'DateTime': 'isIso8601DateTime'
};


/**
	[[fn, 'error message'],
	 [fn, 'error message2' ]]

*/
// var accumulateValidations=function() {
// 	var validationSpecArray= arguments;

// 	dxrefValidator.throwIfNotArray(validationSpecArray);
// 	validationSpecArray.forEach(function(validationSpec) {

// 		dxrefValidator.throwIfNotArray(validationSpec)
// 			.throwIfConditionMet(validationSpec.length<2, 'ValidationSpec is too short!')			
// 			.throwIfNotString(validationSpec[1],true);

// 		var test= dxrefValidator.isFunction(validationSpec[0]) ||
// 				  dxrefValidator.isString(validationSpec[0]);
// 		if (!test) {
// 			throw "Illegal specification for validation in accumulateValidations!";
// 		}

// 	});

// 	return function(fieldName,value,required) {
// 		var reasons=[];
// 		validationSpecArray.forEach(function(vSpec) {

// 			var vfn = vSpec[0];
// 			var result = false;
// 			if (dxrefValidator.isFunction(vfn)) {
// 				result = vSpec[0](fieldName,value,required);
// 			} else { // Spec is a string referring ot a dxrefValidator function...
// 				result = dxrefValidator[vSpec[0]](value,required);
// 			}
			
// 			if (result!==true) {
// 				reasons.push(vSpec[1]);
// 			}
// 		})

// 		return reasons;
// 	};
// };


const EMPTY_ARRAY=[];
let TheReasonValidatorMap = {
	'_f_Id': function(fieldName,value,required) {
		var condition = dxrefValidator.isString(value,required) ||
						dxrefValidator.isNumber(value,required);
		if (!condition) {
			return  ['Field: '+fieldName+' is not an ID type: string/number.'];
		}
		return EMPTY_ARRAY;
	},
	'_f_List.Set': function(fieldName,value,required) {
		if (!dxrefValidator.isArray(value,required)) {
			return ['Field: '+fieldName+' is not an array/set.'];
		}
		if (!value) {
			return EMPTY_ARRAY;
		}
		var uniqList=_.uniq(value);
		if (uniqList.length!==value.length) {
			return ['Field: '+fieldName+' there is at least one duplicate value in the set!'];
		}
		return EMPTY_ARRAY;
	},	
	'_f_Any':function(){ return EMPTY_ARRAY; },
	'_f_Map_Or_List': function(fieldName,value,required) { 
		var condition = dxrefValidator.isObjectMap(value,required) ||
						dxrefValidator.isArray(value,required);
		if (!condition) {
			return  ['Field: '+fieldName+' is not a map/list type'];
		}
		return EMPTY_ARRAY;
	},
	'_f_Named_Function': function(fieldName,value,required) { 
		if (!dxrefValidator.isString(value,required)) {
			return ['Field: '+fieldName+' is not a string to name the function.'];
		}
		return EMPTY_ARRAY;
	}
};

_.forEach(directValidatorMap,function(validationFnName,key) {
	TheReasonValidatorMap['_f_'+key]=function(fieldName,fieldValue,bValueIsRequired) {		
		var result = dxrefValidator[validationFnName](fieldValue,bValueIsRequired);	
		if (result===false) {
			return ['Field: '+fieldName+' with value: '+fieldValue+' is not the expected/required type> '+key];
		}
		return [];
	};
});


export function FieldValidator() {}


FieldValidator.prototype.throwIfNotValid=function(fieldName,fieldType,fieldValue, bValueIsRequired) {
	var validatorFn = this.getThrowValidator(fieldType,true);
	return validatorFn(fieldName,fieldValue,bValueIsRequired);
};


FieldValidator.prototype.isValid=function(fieldName,fieldType,fieldValue, bValueIsRequired) {
	var validatorFn = this.getBooleanValidator(fieldType,true);
	return validatorFn(fieldName,fieldValue,bValueIsRequired);
};


FieldValidator.prototype.getReasonsNotValid=function(fieldName,fieldType,fieldValue, bValueIsRequired) {
	var validatorFn = this.getReasonValidator(fieldType,true);
	return validatorFn(fieldName,fieldValue,bValueIsRequired);
};


FieldValidator.prototype.getReasonsValidator=function(fieldType, doNotReturnUndefined)  {

	var value=TheReasonValidatorMap[fieldType];	
	if (doNotReturnUndefined && value===undefined) {
		return function() { return []; };
	}
	return value;
};


FieldValidator.prototype.getBooleanValidator=function(fieldType, doNotReturnUndefined)  {
	var reasonsValidator = this.getReasonsValidator(fieldType,doNotReturnUndefined);	
	return function(fieldName,value,required) {
		return reasonsValidator(fieldName,value,required).length===0;	
	};
};

FieldValidator.prototype.getThrowValidator=function(fieldType, doNotReturnUndefined)  {
	var reasonsValidator = this.getReasonsValidator(fieldType,doNotReturnUndefined);	
	return function(fieldName,value,required) {
		var reasonsNotValid= reasonsValidator(fieldName,value,required);
		if (reasonsNotValid.length>0) {
			throw new DxrefMultiValidationError('FieldUtils','getThrowValidator',reasonsNotValid);
		}
	};
};

FieldValidator.prototype.isValidFieldType=function(typeName) {
	if (typeName.indexOf('_f_')!==0) {
		return false;
	}
	var typeKey = typeName.substring(3);
	var typeKeyEnd = typeKey.indexOf('.');
	if (typeKeyEnd!==-1) {
		typeKey = typeKey.substring(0,typeKeyEnd);
	}
	typeKey = typeKey.toUpperCase();

	var exists = FieldConstants.Type[typeKey];

	return exists!==undefined;
};

var theFieldValidator = new FieldValidator();
export default theFieldValidator;

