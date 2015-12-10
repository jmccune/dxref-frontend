import { dxrefValidator, Constants } from 'dxref/dxref-config';

function FieldInfoUtils() {

}

// ----- Utilities based on field info ----- -
FieldInfoUtils.prototype.getStandardValidatorMap=function() {

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
	validatorMap[Constants.SET]=function(name,value,required) {
		dxrefValidator.throwIfNotArray(name,value,required);
	}

	FieldInfoUtils.prototype.standardValidatorMap= validatorMap;
	return validatorMap;
};


FieldInfoUtils.prototype.validateBasedOnFieldInfo=function( metaInfo,jsonData) {
	if (!metaInfo || !metaInfo.fieldSet) {
		throw "FieldInfoUtils>> Unable to validate -- no meta/fieldinfo?! ";
	}
	
	var validatorMap = this.getStandardValidatorMap();
	
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