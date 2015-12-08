import { dxrefValidator, Constants } from 'dxref/dxref-config';

var logger = log4javascript.getLogger('dxref/models/meta/field-info-generator');

function FieldInfoGenerator() {
	this.fieldInfoArray=null;
}

FieldInfoGenerator.prototype.startDefinition=function() {
	this.fieldInfoArray=[];
	return this;
};

FieldInfoGenerator.prototype.addField=function(name,type,required,editable,displayable,fmtInfo) {
	if (!this.fieldInfoArray) {
		throw "Has not started definition!";
	}

	if (!name) {
		throw "Name is required!";
	}

	if (!type) {
		throw "Type is required!";
	}

	if (required!==Constants.REQUIRED && required!==Constants.OPTIONAL) {
		required=Constants.OPTIONAL;
	}

	if (editable!==Constants.EDITABLE && editable!==Constants.UNEDITABLE) {
		editable=Constants.EDITABLE;
	}
	if (displayable!==true && displayable!==false) {
		displayable=true;
	}

	this.fieldInfoArray.push({
		'name':name,
		'type':type,
		'required':required,
		'editable':editable,
		'displayable': displayable,
		'fmtInfo' :fmtInfo
	});

	return this;
};


FieldInfoGenerator.prototype.done=function() {
	var result = this.fieldInfoArray;
	this.fieldInfoArray=null;
	return result;
};



// ----- Utilities based on field info ----- -
FieldInfoGenerator.prototype.getStandardValidatorMap=function() {

	if (FieldInfoGenerator.prototype.standardValidatorMap) {
		return FieldInfoGenerator.prototype.standardValidatorMap;
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

	FieldInfoGenerator.prototype.standardValidatorMap= validatorMap;
	return validatorMap;
};


FieldInfoGenerator.prototype.validateBasedOnFieldInfo=function( metaInfo,jsonData) {
	if (!metaInfo || !metaInfo.fieldInfo) {
		throw "FieldInfoGenerator>> Unable to validate -- no meta/fieldinfo?! ";
	}
	
	var validatorMap = this.getStandardValidatorMap();
	
	_.forEach(metaInfo.fieldInfo, function(value) {
		var key = value.name;		
		var type = value.type;
		var required = value.required;

		var jsonValue = jsonData[key];
		var validator = validatorMap[type];
		if (validator) {
			try {
				validator(key,jsonValue,required);
			}
			catch (e) {
				logger.error(e+" caused with value: "+jsonValue+" for key: "+key);
				throw e;
			}
		}
	});
}



var theFieldInfoGenerator = new FieldInfoGenerator();
export default theFieldInfoGenerator;