import DroRegistry from 'dxref/models/dro/dro-registry';

var logger = log4javascript.getLogger('dxref.models.dro.node-relation-extra-dro');

//Validator (DXREF-12)
var validator = decorationValidator;
var REQUIRED = true;


export default function NodeRelationExtraDro(json) {

	this.initFromJson(json);

}




function populateNode(jsonNode) {
	
	if (jsonNode) {
		validator.throwIfNotObjectMap("meta",jsonNode.meta)
			.throwIfNotString("meta.dtoType",jsonNode.meta.dtoType);

		// Adapt JSON response to verified/validated object, using the registry
		// to create the appropriate response
		return DroRegistry.createObject(jsonNode.meta.dtoType, jsonNode);			
	}
	return null;
}

function populateExtraInfo(json) {
	var result = {};
	_.forEach(json,function(value, id) {

		if (!value || !value.meta || !value.meta.dtoType) {
			logger.error("Unable to lookup: "+value+" for id: "+id);
			return;
		}
		
		result[id] =  DroRegistry.createObject(value.meta.dtoType,value);
	});

	return result;
}

NodeRelationExtraDro.prototype.initFromJson= function(json) {
	validator.throwIfNotObjectMap("node",json.node)		
		.throwIfNotString("nodeType",json.nodeType,REQUIRED)
		.throwIfNotObjectMap("relations",json.relations)
		.throwIfNotObjectMap("extraInfo",json.extraInfo);


	json.node = populateNode(json.node);
	json.extraInfo = populateExtraInfo(json.extraInfo);

	_.assign(this,json);
	return this;
};
