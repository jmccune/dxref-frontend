import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { ObjectSpecificationBuilder } from 'dxref/core/model/meta/object-specification-builder';
import { ObjectSpecificationBasedModel } from 'dxref/core/model/object-specification-based-model';

let FT = FieldConstants.Type;

export default class ContentElementDro extends ObjectSpecificationBasedModel {
	constructor(json) {
		super();
		this.initFromJson(json);
	}
}

ContentElementDro.prototype.specification = new ObjectSpecificationBuilder('ContentElementDro')
	.addField('id',FT.ID,true)
	.addField('contentLines',FT.LIST,true)
	.completeObjectSpec();