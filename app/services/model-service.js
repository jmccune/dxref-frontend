import { dxrefValidator } from 'dxref/dxref-config';

// ==================================================================
// FUNCTIONS
// ==================================================================

function convertToListOfModelsFn(DxrefModel,jsonList){ 
	var result  =[];
	_.forEach(jsonList, function(item) {
		var model = new DxrefModel(item);
		result.push(model);
	});
	return result;
}

function buildModelBasis(name, specArg) {

	var specGenerator = null;
	if (dxrefValidator.isFunction(specArg)) {
		specGenerator = specArg;
	}
	else if (dxrefValidator.isObjectMap(specArg)) {		
		specGenerator = function() { return specArg; };		
	}
	else {
		console.log("IllegalSpec>> ");
		console.dir(specArg);
		throw "Illegal Model Specification: "+specArg;
	}

	//var getReasonDataNotValidFn = createObjectDataValidatorFrom(spec);

	
	var ModelServiceObject=function(json) {
		var args = Array.prototype.slice.call(arguments, 1);
		this.setupValidator.apply(this,args);
		this.initFromJson(json);
	};

	ModelServiceObject.prototype.setupValidator=function(args) {
		var spec = specGenerator(args);		
		ModelServiceObject.prototype.validateData= createObjectDataValidatorFrom(spec);
	};


	ModelServiceObject.prototype.initFromJson = function(json) {			
		var reasonNotValid = this.validateData(json); 			
		if (reasonNotValid) { 				
			throw reasonNotValid;
		}
		_.assign(this,json);
	};

	ModelServiceObject.prototype.MsObjectType = name;
	ModelServiceObject.prototype.getObjectType = function() {return this.MsObjectType;};
	return ModelServiceObject;
}
	


// ==================================================================
// VALIDATION SETUP
// ==================================================================

/**
 *  So I'm not going to use Ember's model & stores....   Too much convention and this application
 *  won't follow the typical data-modeling rules enough to make it worth it.
 *  But I still like validation of the known/required fields-- so this will enable that.
 */

var getValidator=function(type, required, options) {
	if (type==='id' || type==='string') {
		return function(obj,key,value) {
			dxrefValidator.throwIfNotString(key,value,required);
		};
	}
	else if (type==='number') {
		return function(obj,key,value) {
			dxrefValidator.throwIfNotNumber(key,value,required);
		};
	}
	else if (type==='integer') {
		return function(obj,key,value) {
			dxrefValidator.throwIfNotInteger(key,value,required);
		};	
	}
	else if (type==='list') {
		return function(obj,key,value) {
			dxrefValidator.throwIfNotArray(key,value,required);
			if (options.elementType) {
				var replacementArray = convertToListOfModelsFn(options.elementType,value);
				obj[key] = replacementArray;
			}
		};
	}
	throw "Unrecognized data type: "+type;	
};


var createObjectDataValidatorFrom=function(spec) {

	return function(json) {				
		var reasonNotValid;

		dxrefValidator.throwIfNotObjectMap(json);		
		_.each(spec, function(fieldValidator,key) {
			var fieldReasonNotValid = fieldValidator(json, key, json[key]);
			if (fieldReasonNotValid) {
				reasonNotValid = fieldReasonNotValid;
			}
		});
		return reasonNotValid;
	};
};


// ==================================================================
// MAIN EXPORT
// ==================================================================

export default {

	convertToListOfModels: convertToListOfModelsFn,
 	Model: buildModelBasis,

 	PropertyType: function(type, required, options) {
 		if (typeof options === 'undefined') {
 			options={};
 		}
 		return getValidator(type,required,options);
 	}
 };