import { dxrefValidator } from 'dxref/dxref-config';

/**
 *  So I'm not going to use Ember's model & stores....   Too much convention and this application
 *  won't follow the typical data-modeling rules enough to make it worth it.
 *  But I still like validation of the known/required fields-- so this will enable that.
 */

var getValidator=function(type, required) {
	if (type==='id' || type==='string') {
		return function(key,value) {
			dxrefValidator.throwIfNotString(key,value,required);
		};
	}

	throw "Unrecognized data type: "+type;	
};


var createObjectDataValidatorFrom=function(spec) {

	return function(json) {				
		var reasonNotValid;

		dxrefValidator.throwIfNotObjectMap(json);		
		_.each(spec, function(fieldValidator,key) {
			var fieldReasonNotValid = fieldValidator(key, json[key]);
			if (fieldReasonNotValid) {
				reasonNotValid = fieldReasonNotValid;
			}
		});

		console.log("REASON NOT VALID: "+reasonNotValid);
		return reasonNotValid;
	};
};



export default {

 	Model: function(spec) {
 		dxrefValidator.throwIfNotObjectMap(spec);

 		var getReasonDataNotValidFn = createObjectDataValidatorFrom(spec);

 		var f1 =function(json) {
 			this.initFromJson(json);
 		};

 		f1.prototype.initFromJson = function(json) {
 			var reasonNotValid = getReasonDataNotValidFn(json); 			
 			if (reasonNotValid) { 				
 				throw reasonNotValid;
 			}
 			_.assign(this,json);
 		};
 		return f1;
 	},

 	PropertyType: function(type, required, options) {
 		return getValidator(type,required,options);
 	}
 };