var logger = log4javascript.getLogger('dxref.models.dro.decoration-set-dro');

//Validator (DXREF-12)
var validator = decorationValidator;
var REQUIRED = true;

export default function DecorationSetDro(json) {

	this.initFromJson(json);
}

DecorationSetDro.prototype.initFromJson = function(json) {
	validator
		.throwIfNotString("name",json.name,REQUIRED)
		.throwIfNotArray("decorations",json.decorations,REQUIRED);

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