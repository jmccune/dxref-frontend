import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/utils/field-types';
import { OrderedArgumentInterpreter } from 'dxref/utils/support/ordered-argument-interpreter';


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
};

OrderedArgumentBuilder.prototype.add=function(fieldName,fieldType,required) {

	dxrefValidator
		//.setErrorPrefix('OrderedArgumentBuilder>> ')
		.throwIfNotString('1st argument: "fieldName"',fieldName,true)
		.throwIfNotString(fieldName+' 2nd argument: "fieldType" ',fieldType,true)
		.throwIfNotBoolean(fieldName+' 3rd argument: "required" ',required,true);

	
	if (!theFieldUtils.isValidFieldType(fieldType)) {
		throw "OrderedArgumentBuilder#add>> Undefined field type: ("+fieldName+","+fieldType+","+required+")";
	}

	this.specification.orderedArgumentSpecs.push([fieldName,fieldType,required]);

	return this;
};

OrderedArgumentBuilder.prototype.addOption=function(fieldName,fieldType) {
	dxrefValidator
		//.setErrorPrefix('OrderedArgumentBuilder>> ')
		.throwIfNotString('1st argument: "fieldName"',fieldName,true)
		.throwIfNotString(fieldName+' 2nd argument: "fieldType" ',fieldType,true);

	if (!theFieldUtils.isValidFieldType(fieldType)) {
		throw "OrderedArgumentBuilder#addOption>> Undefined field type: ("+fieldName+","+fieldType+")";
	}

	this.specification.optionalArgumentMap[fieldName]=fieldType;

	return this;
};


OrderedArgumentBuilder.prototype.build=function() {
	var argumentInterpreter = new OrderedArgumentInterpreter(this.specification);
	this._init();
	return argumentInterpreter;
};

