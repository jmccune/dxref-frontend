import { dxrefValidator, Constants } from 'dxref/dxref-config';
var logger = log4javascript.getLogger('dxref/models/meta/field-info-utils');
function FieldInfoUtils() {

}

// ----- Utilities based on field info ----- -
FieldInfoUtils.prototype._getStandardValidatorMap=function() {
	var _this=this;
	if (FieldInfoUtils.prototype.standardValidatorMap) {
		return FieldInfoUtils.prototype.standardValidatorMap;
	}

	var validatorMap = {}
	validatorMap[Constants.STRING]=function(name,value,required) {
		dxrefValidator.throwIfNotString(name,value,required);
	};
	validatorMap[Constants.DATETIME]=function(name,value,required) {
		dxrefValidator.throwIfNotIso8601DateTime(name,value,required);
	}
	validatorMap[Constants.SET]=function(name,valueSet,required,fieldInfo) {
		dxrefValidator.throwIfNotArray(name,valueSet,required);
		_this._checkRestrictedValues(name, valueSet,fieldInfo);
	}

	FieldInfoUtils.prototype.standardValidatorMap= validatorMap;
	return validatorMap;
};

FieldInfoUtils.prototype._checkRestrictedValues=function(name,valueArray,fieldInfo) {
	//Set restriction values...
	if (!fieldInfo.restrictedValues) {
		return;
	}
	_.forEach(valueArray,function(v){
		if (!_.contains(fieldInfo.restrictedValues,v)) {
			throw "Value: "+v+" is not in expected set of values!";
		}
	});	
};

FieldInfoUtils.prototype.validateBasedOnFieldInfo=function( metaInfo,jsonData) {
	if (!metaInfo || !metaInfo.fieldSet) {
		throw "FieldInfoUtils>> Unable to validate -- no meta/fieldinfo?! ";
	}
	
	var validatorMap = this._getStandardValidatorMap();
	
	_.forEach(metaInfo.fieldSet, function(fieldInfo) {
		var key = fieldInfo.name;		
		var type = fieldInfo.type;
		var required = fieldInfo.required;

		var jsonValue = jsonData[key];
		var validator = validatorMap[type];
		if (validator) {
			try {
				validator(key,jsonValue,required,fieldInfo);
			}
			catch (e) {
				logger.error(e+" caused with value: "+jsonValue+" for key: "+key);
				throw e;
			}
		}
	});
}


var theFieldInfoUtils = new FieldInfoUtils();
export default theFieldInfoUtils;