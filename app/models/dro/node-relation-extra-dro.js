import DroRegistry from 'dxref/models/dro/dro-registry';
import { dxrefValidator, Constants } from 'dxref/dxref-config';

var logger = log4javascript.getLogger('dxref.models.dro.node-relation-extra-dro');

export default function NodeRelationExtraDro(json) {
	this.initFromJson(json);
}

function populateNode(jsonNode) {
	
	if (jsonNode) {
		dxrefValidator.throwIfNotObjectMap("meta",jsonNode.meta)
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

		var dtoType = null;
		if (value && value.meta && value.meta.dtoType) {
			dtoType = value.meta.dtoType;
		}
		else if (value.title) { 
			//DEFAULT (if not a complex object)
			// is a simple search result sort of thing.
			dtoType = 'SearchResultModel';

		}
		else {
			logger.warn("Unable to lookup: "+value+" for id: "+id);
			return;
		}
		
		result[id] =  DroRegistry.createObject(dtoType,value);
	});

	return result;
}

NodeRelationExtraDro.prototype.initFromJson= function(json) {
	dxrefValidator.throwIfNotObjectMap("node",json.node)		
		.throwIfNotString("nodeType",json.nodeType,Constants.REQUIRED)
		.throwIfNotObjectMap("relations",json.relations)
		.throwIfNotObjectMap("extraInfo",json.extraInfo);


	json.node = populateNode(json.node);
	json.extraInfo = populateExtraInfo(json.extraInfo);

	_.assign(this,json);
	return this;
};
