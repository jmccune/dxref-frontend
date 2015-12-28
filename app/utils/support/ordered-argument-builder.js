import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/utils/field-types';
import { OrderedArgumentInterpreter } from 'dxref/utils/support/ordered-argument-interpreter';





/** DEPRECATED **/





export function OrderedArgumentBuilder() {
	this._init();	
}


OrderedArgumentBuilder.prototype._init=function() {
	this.specification= {
		orderedArgumentSpecs: [], /** Arguments passed into the interpretrer match this order. */
		optionalArgumentMap: {}, /** Other arguments -- only in the option map. */
		options: {
			doValidation: true,   /** Should we validate fields with known types?*/
			isOpen: true  /** True if an unknown option/property in the map should be ignored. */
		}
	};
	this.lastArgumentAdded = null;
};

/** The principal method-- add the fields desired in order that they are expected. */
OrderedArgumentBuilder.prototype.add=function(fieldName,fieldType,required) {

	dxrefValidator
		//.setErrorPrefix('OrderedArgumentBuilder>> ')
		.throwIfNotString('1st argument: "fieldName"',fieldName,true)
		.throwIfNotString(fieldName+' 2nd argument: "fieldType" ',fieldType,true)
		.throwIfNotBoolean(fieldName+' 3rd argument: "required" ',required,true);

	
	if (!theFieldUtils.isValidFieldType(fieldType)) {
		throw "OrderedArgumentBuilder#add>> Undefined field type: ("+fieldName+","+fieldType+","+required+")";
	}

	this.lastArgumentAdded = [fieldName,fieldType,required];
	this.specification.orderedArgumentSpecs.push(this.lastArgumentAdded);
	
	return this;
};

/* These arguments are never expected to be part of the single field argument list, only the option map */
OrderedArgumentBuilder.prototype.addOption=function(fieldName,fieldType) {
	dxrefValidator
		//.setErrorPrefix('OrderedArgumentBuilder>> ')
		.throwIfNotString('1st argument: "fieldName"',fieldName,true)
		.throwIfNotString(fieldName+' 2nd argument: "fieldType" ',fieldType,true);

	if (!theFieldUtils.isValidFieldType(fieldType)) {
		throw "OrderedArgumentBuilder#addOption>> Undefined field type: ("+fieldName+","+fieldType+")";
	}

	this.specification.optionalArgumentMap[fieldName]=fieldType;
	this.lastArgumentAdded = fieldName;
	return this;
};



OrderedArgumentBuilder.prototype.setDefault=function(defaultValue) {
	this._secureArgumentOptionMap().defaultValue = defaultValue;
};

OrderedArgumentBuilder.prototype._secureArgumentOptionMap=function() {
	if (!this.lastArgumentAdded) {
		throw "OrderedArgumentBuilder#_secureArgumentOptionMap>> no argument to extend!  You need to add field/option first";
	}
	var optionMap = {};
	if (this.lastArgumentAdded.length===3) {
		this.lastArgumentAdded.push(optionMap);
	} else {
		optionMap = this.lastArgumentAdded[3];  //4th argument is the option map
	}
	return optionMap;
};


OrderedArgumentBuilder.prototype.build=function() {
	var argumentInterpreter = new OrderedArgumentInterpreter(this.specification);
	this._init();
	return argumentInterpreter;
};

