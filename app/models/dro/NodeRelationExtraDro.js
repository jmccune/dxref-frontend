

//Validator
var validator = decorationValidator;
var REQUIRED = true;

export default function NodeRelationExtraDro(nreJson) {

	validator.throwIfNotObjectMap(nreJson.node)
		.throwIfNotString("nodeType",nreJson.nodeType,REQUIRED)
		.throwIfNotObjectMap("relations",nreJson.relations)
		.throwIfNotObjectMap("extraInfo",nreJson.extraInfo);

	_.assign(this,nreJson);
}