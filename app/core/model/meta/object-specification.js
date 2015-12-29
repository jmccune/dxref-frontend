
import { DxrefError } from 'dxref/core/errors/dxref-errors';

/**  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	See _object-spec.md for documentation 
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

export function ObjectSpecification() {
	this._meta= {
		requiredFields: [],
		defaultValueFields: []
	};
}

ObjectSpecification.prototype.getRequiredFields=function() {
	return this._meta.requiredFields;
};


ObjectSpecification.prototype.validateThisSpecification=function() {
	/** TBD:  Validates that the required fields are consistent,
		that fields have the expected/required fields, etc. */
};


/** Processes the given arguments into a data map based on argument
    ordering-- assuming it exists.   Default values are used and given
    to attributes that have defaults but those were not specified.
*/
ObjectSpecification.prototype.convertToDataMap=function() {

	if (!this._meta.argumentOrder) {
		if (arguments.length!==1) {
			throw new DxrefError('ObjectSpecification','convertToDataMap','No ordered arguments given!');
		}
		this._meta.argumentOrder=[];
	}

	if (arguments.length > this._meta.argumentOrder.length+1) {
		throw new DxrefError('ObjectSpecification','convertToDataMap',
			'Too many ('+arguments.length+')arguments given >> max of: '+(this._meta.argumentOrder.length+1)+'allowed');
	}

	// Convert from direct argument...
	var givenArguments = arguments;
	var dataMap = {};
	for (var i=0; i<givenArguments.length; i++) {
		var fieldName = this._meta.argumentOrder[i];
		var value = givenArguments[i];	
		if (i===(givenArguments.length-1) && _.isObject(value)) {
			dataMap = _.merge(dataMap, value);
		}  else {
			dataMap[fieldName] = value;
		}
	}

	//Enrich with defaults...
	var specification = this;
	if (this._meta.defaultValueFields) {
		this._meta.defaultValueFields.forEach(function(fieldName) {
			if (dataMap.hasOwnProperty(fieldName)) {
				return;
			}
			dataMap[fieldName] = specification[fieldName].defaultValue;
		});
	}
	return dataMap;
};
