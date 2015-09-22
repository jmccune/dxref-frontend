import { dxrefValidator, Constants } from 'dxref/dxref-config';

var logger = log4javascript.getLogger('dxref.models.dro.decoration-set-dro');

export default function DecorationSetDro(json) {

	this.initFromJson(json);
}

DecorationSetDro.prototype.initFromJson = function(json) {
	dxrefValidator
		.throwIfNotString("name",json.name,Constants.REQUIRED)
		.throwIfNotArray("decorations",json.decorations,Constants.REQUIRED);

	var decorations = [];

	_.forEach(json.decorations, function(decorationArray){
		if (!_.isArray(decorationArray) || decorationArray.length!==6) {
			logger.error("Unexpected input in array: "+JSON.stringify(decorationArray));
			return;			
		}
		decorations.push(new DecorationModel(decorationArray));
	});


	_.assign(this, {
		name: json.name,
		decorations: decorations		
	});

	return this;
};