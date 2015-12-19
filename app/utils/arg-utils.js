import { dxrefValidator } from 'dxref/dxref-config';
import { theFieldUtils } from 'dxref/utils/field-types';
/*

	When building up an argument list, you may have a default argument ordering.
	a,b,c,d,e...  where the last of the arguments is a MAP which defines the
	rest of the options that the map can use. 



*/


var OrderedArgumentBuilder=function() {
	this.argumentOrder=[];
	
};


OrderedArgumentBuilder.prototype.add=function(fieldName,fieldType,required) {

		console.log("*** FIELD TYPE: "+fieldName+" >> "+fieldType);
		dxrefValidator
			//.setErrorPrefix('OrderedArgumentBuilder>> ')
			.throwIfNotString('1st argument: "fieldName"',fieldName,true)
			.throwIfNotString(fieldName+' 2nd argument: "fieldType" ',fieldType,true)
			.throwIfNotBoolean(fieldName+' 3rd argument: "required" ',required,true);

		
		if (!theFieldUtils.isValidFieldType(fieldType)) {
			throw "OrderedArgumentBuilder>> Undefined field type: ("+fieldName+","+fieldType+","+required+")";
		}

		return this;
};



let argUtils = {
	createOrderedArgumentBuilder: function() { return new OrderedArgumentBuilder(); }
};


export default argUtils;