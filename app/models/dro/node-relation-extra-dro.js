import DroRegistry from 'dxref/models/dro/dro-registry';

//Validator (DXREF-12)
var validator = decorationValidator;
var REQUIRED = true;

export default function NodeRelationExtraDro(json) {

	validator.throwIfNotObjectMap("node",json.node)		
		.throwIfNotString("nodeType",json.nodeType,REQUIRED)
		.throwIfNotObjectMap("relations",json.relations)
		.throwIfNotObjectMap("extraInfo",json.extraInfo);

	if (json.node) {
		validator.throwIfNotObjectMap("node.meta",json.node.meta)
			.throwIfNotString("node.meta.dtoType",json.node.meta.dtoType);
	
		// Adapt JSON response to verified/validated object, using the registry
		// to create the appropriate response
		json.node = DroRegistry.createObject(json.node.meta.dtoType, json.node);			
	}

	_.assign(this,json);
	return this;
}