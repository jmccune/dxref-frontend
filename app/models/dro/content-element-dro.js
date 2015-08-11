
//Validator (DXREF-12)
var validator = decorationValidator;
var REQUIRED = true;

export default function ContentElementDro(json) {

	this.initFromJson(json);
}

ContentElementDro.prototype.initFromJson = function(json) {
	validator
		.throwIfNotString("id",json.id,REQUIRED)
		.throwIfNotArray("contentLines",json.contentLines,REQUIRED);

	_.assign(this,json);
	return this;
};