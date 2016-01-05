import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { ObjectSpecificationBuilder } from 'dxref/core/model/meta/object-specification-builder';
import { ObjectSpecificationBasedModel } from 'dxref/core/model/object-specification-based-model';


let FT = FieldConstants.Type;

/** Denotes some content that the user is working with.   This is materially different
from the other content entities in the system which are read-only and have the function
of providing primarily context/relations to the user. */
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
		.collectionElementType(FT.STRING)
	.addField('type',FT.STRING,false)
		.choices(true, ['comment','insight','definition','equivalence'])
	.completeObjectSpec();