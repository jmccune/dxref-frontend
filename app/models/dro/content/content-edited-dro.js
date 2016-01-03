import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { ObjectSpecificationBuilder } from 'dxref/core/model/meta/object-specification-builder';
import { ObjectSpecificationBasedModel } from 'dxref/core/model/object-specification-based-model';


let FT = FieldConstants.Type;

export default class ContentEditedDro extends ObjectSpecificationBasedModel {
	constructor(json) {
		super();
		this.initFromJson(json);
	}
}

ContentEditedDro.prototype.specification = new ObjectSpecificationBuilder('ContentEditedDro')
	.addField('id',FT.ID, true)
	.addField('createdDate',FT.DATETIME,true)
	.addField('updatedDate',FT.DATETIME,true)
	.addField('labels',FT.SET,true)
	.addField('type',FT.STRING,false)
	.completeObjectSpec();