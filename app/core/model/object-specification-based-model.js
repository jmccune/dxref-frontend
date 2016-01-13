

export class ObjectSpecificationBasedModel {

	constructor() {}

	getSpecification() {
		return this.constructor.prototype.specification;
	}

	initFromJson(json) {
		var objectRep = this.getSpecification().convertToDataMap(json);
		this.getSpecification().throwIfNotValidData(objectRep);

		_.assign(this,objectRep);
		return this;
	}

}