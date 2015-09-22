import { dxrefValidator } from 'dxref/dxref-config';


//Props to Yehuda Katz...
function newObject(func) {  
  // get an Array of all the arguments except the first one
  var args = Array.prototype.slice.call(arguments, 1);

  // create a new object with its prototype assigned to func.prototype
  var object = Object.create(func.prototype);

  // invoke the constructor, passing the new object as 'this'
  // and the rest of the arguments as the arguments
  func.apply(object, args);

  // return the new object
  return object;
}

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
	if (type=='number') {
		return function(key,value) {
			dxrefValidator.throwIfNotNumber(key,value,required)
		}
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
		return reasonNotValid;
	};
};



export default {

	convertToListOfModels: function(dxrefModel,jsonList){ 
		var result  =[];
		_.forEach(jsonList, function(item) {
			var model = new dxrefModel(item);
			result.push(model);
		});
		return result;
	},


 	Model: function(name,spec) {
 		dxrefValidator.throwIfNotObjectMap(spec);

 		var getReasonDataNotValidFn = createObjectDataValidatorFrom(spec);

 		
 		var ModelServiceObject=function(json) {
 			this.initFromJson(json);
 		};

 		ModelServiceObject.prototype.initFromJson = function(json) {
 			var reasonNotValid = getReasonDataNotValidFn(json); 			
 			if (reasonNotValid) { 				
 				throw reasonNotValid;
 			}
 			_.assign(this,json);
 		};

 		ModelServiceObject.prototype.MsObjectType = name;
 		ModelServiceObject.prototype.getObjectType = function() {return this.MsObjectType;}
 		return ModelServiceObject;
 	},

 	PropertyType: function(type, required, options) {
 		return getValidator(type,required,options);
 	}
 };