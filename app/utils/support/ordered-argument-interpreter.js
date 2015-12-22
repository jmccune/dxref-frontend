import { theFieldUtils } from 'dxref/utils/field-types';
/** OrderArgumentInterpreter -- does the actual conversion from an arugment list to
	the arguments.  Validating (as designated by the build specification.)


	this.specification= {
		orderedArgumentSpecs: [ <fieldName:string>, <fieldType:string>, <required:boolean>],
		options: {
			doValidation: true,   // Should we validate fields with known types?
			isOpen: true  // True if an unknown option/property in the map should be ignored. 
		}
	};

*/
export function OrderedArgumentInterpreter(specification) {
	this.specification = specification;


	let requiredArgMap={};
	let optionalArgMap={};
	var options = this.specification.options;

	_.forEach(this.specification.orderedArgumentSpecs,function(spec) {
		if (spec[2]) {
			requiredArgMap[spec[0]]=spec[1];
		} else {
			optionalArgMap[spec[0]]=spec[1];
		}
	});

	this.validationFn=function(argMap) {
		_.forEach(requiredArgMap,function(fieldType,fieldName) {
			var fieldValue = argMap[fieldName];
			if (fieldValue===undefined) {
				throw 'OrderedArgumentInterpreter>> Object didn\'t have field name: '+fieldName+' which is required!';
			}

			if (options.doValidation) {
				if (!theFieldUtils.isValid(fieldType,fieldValue,true)) {
					throw 'OrderedArgumentInterpreter>> given value of: '+fieldValue+' for parameter: '+fieldName+' is not valid!';
				}
			}
		});

		if (options.doValidation) {
			_.forEach(optionalArgMap,function(fieldType,fieldName) {
				var fieldValue = argMap[fieldName];	
				if (!theFieldUtils.isValid(fieldType,fieldValue,false)) {
					throw 'OrderedArgumentInterpreter>> given value of: '+fieldValue+' for parameter: '+fieldName+' is not valid!';
				}
			});
		}  

		if (!options.isOpen) {
			_.forEach(argMap,function(value,fieldName) {
				if (!requiredArgMap[fieldName] && !optionalArgMap[fieldName]) {
					throw 'field: '+fieldName+' isn\'t part of the allowed parameter set.';
				}
			});
		}
	};
}

OrderedArgumentInterpreter.prototype.convertToMap=function() {
	var givenArguments = arguments;
	var orderedArgumentSpecs = this.specification.orderedArgumentSpecs;
	

	if (givenArguments.length>orderedArgumentSpecs.length) {
		throw "OrderedArgumentInterpreter>> Too many arguments: "+givenArguments.length+">" + orderedArgumentSpecs.length;
	}

	var argMap = {};
	for (var i=0; i<givenArguments.length; i++) {
		var fieldName = orderedArgumentSpecs[i][0];	
		var value = givenArguments[i];	
		if (i===(givenArguments.length-1) && _.isObject(value)) {
			argMap = _.merge(value, argMap);
		}  else {
			argMap[fieldName] = value;
		}
	}

	this.validationFn(argMap);

	return argMap;
};