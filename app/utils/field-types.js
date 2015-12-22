import { dxrefValidator } from 'dxref/dxref-config';
/** 
FieldType Rules:
	must begin with '_f_'
	anything before the first period (and after the _f_ prefix) must 
		match exactly ONE typename.
			(e.g. "_f_This_Must_Exist.who_cares_about_this.and_this_can_not_exist_too"  would
			mean that there must be a Type named "THIS_MUST_EXIST" in the type map.
*/
export const FieldConstants= {	
	Type: { 
		ID:         '_f_Id',
		STRING:     '_f_String',
		DATETIME:   '_f_DateTime',  		
		DATE:       '_f_DateTime.Date',
		TIME: 		'_f_DateTime.Time',
		LIST:       '_f_List',    // a list/array 
		SET:        '_f_Set',     // a list/array where values do not (cannot) repeat.
		NUMBER:     '_f_Number',
		BOOLEAN:    '_f_Boolean'
	},
	SetAttributes: {		   //Can other (arbitrary) fields be added?
		OPEN: 	     'open',	   // Yes
		CLOSED:      'closed',     // No
		CONSTRAINED: 'constrained' //FUTURE... TBD. 
	}
};


/** Simple types & primitives likely directly validate against the js-validator
    library.  More complext types are defined below, but simpler ones are defined
    here and then built. */
var directValidatorMap={	
	'String': 'isString',
	'List'  : 'isArray',
	'Number': 'isNumber',
	'Boolean': 'isBoolean'
};

var builtMap = {
	'_f_Id': function(value,required) {
		return dxrefValidator.isString(value,required) ||
			dxrefValidator.isNumber(value,required);
	},
	'_f_Set': function(value,required) {
		if (!dxrefValidator.isArray(value,required)) {
			return false;
		}
		if (!value) {
			return true;
		}
		var uniqList=_.uniq(value);
		return uniqList.length===value.length;
	}	
};

_.forEach(directValidatorMap,function(validationFnName,key) {
	builtMap['_f_'+key]=function(fieldValue,bValueIsRequired) {
		return dxrefValidator[validationFnName](fieldValue,bValueIsRequired);
	};
});

export const FieldValidatorMap = builtMap;


function FieldUtils() {}


FieldUtils.prototype.getValidator=function(fieldType, doNotReturnUndefined)  {

	var value=FieldValidatorMap[fieldType];	
	if (doNotReturnUndefined && value===undefined) {
		return function() { return true; };
	}
	return value;
};

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

FieldUtils.prototype.isValid=function(fieldType, fieldTypeValue, bValueIsRequired) {
	var validatorFn= this.getValidator(fieldType,true);
	return validatorFn(fieldTypeValue, bValueIsRequired);
};

export var theFieldUtils = new FieldUtils();
