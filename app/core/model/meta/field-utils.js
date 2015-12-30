/**** DEPRECATED ****/
import { dxrefValidator } from 'dxref/dxref-config';
import { FieldConstants } from 'dxref/core/model/meta/field-types';

/** Simple types & primitives likely directly validate against the js-validator
    library.  More complext types are defined below, but simpler ones are defined
    here and then built. */
var directValidatorMap={	
	'String': 'isString',
	'List'  : 'isArray',
	'Number': 'isNumber',
	'Boolean': 'isBoolean',
	'Function': 'isFunction'
};

var validatorMap = {
	'_f_Id': function(fieldName,value,required) {
		return dxrefValidator.isString(value,required) ||
			dxrefValidator.isNumber(value,required);
	},
	'_f_List.Set': function(fieldName,value,required) {
		if (!dxrefValidator.isArray(value,required)) {
			return false;
		}
		if (!value) {
			return true;
		}
		var uniqList=_.uniq(value);
		return uniqList.length===value.length;
	},
	'_f_Any':function(){ return true; },
	'_f_Map_Or_List': function() { return true;},
	'_f_Named_Function': function() { return true;}
};

_.forEach(directValidatorMap,function(validationFnName,key) {
	validatorMap['_f_'+key]=function(fieldName,fieldValue,bValueIsRequired) {
		return dxrefValidator[validationFnName](fieldValue,bValueIsRequired);	
	};
});

export const FieldValidatorMap = validatorMap;


function FieldUtils() {}


FieldUtils.prototype.getValidator=function(fieldType, doNotReturnUndefined)  {

	var value=FieldValidatorMap[fieldType];	
	if (doNotReturnUndefined && value===undefined) {
		return function() { return true; };
	}
	return value;
};

// FieldUtils.prototype.getReasonValidator=function(fieldName,doNotReturnUndefined) {

// 	var validator = this.getValidator();
// 	return function(fieldName,value,required) {
// 		var result = validator(fieldName,value,required);
// 		if (result===false) {
// 			return 'Field: '+fieldName+' with value: '+fieldValue+' is not the expected/required type> '+key;
// 		}
// 		return result;
// 	}

		
// };

FieldUtils.prototype.isValidFieldType=function(typeName) {
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

FieldUtils.prototype.isValid=function(fieldName, fieldType, fieldTypeValue, bValueIsRequired) {
	var validatorFn= this.getValidator(fieldType,true);
	return validatorFn(fieldName, fieldTypeValue, bValueIsRequired);
};

export var theFieldUtils = new FieldUtils();