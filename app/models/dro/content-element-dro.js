import { dxrefValidator, Constants } from 'dxref/dxref-config';

export default function ContentElementDro(json) {
	this.initFromJson(json);
}

ContentElementDro.prototype.initFromJson = function(json) {
	dxrefValidator
		.throwIfNotString("id",json.id,Constants.REQUIRED)
		.throwIfNotArray("contentLines",json.contentLines,Constants.REQUIRED);

	_.assign(this,json);
	return this;
};