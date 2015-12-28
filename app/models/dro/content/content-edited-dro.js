
import { Constants } from 'dxref/dxref-config';
import { FieldConstants } from 'dxref/utils/field-types';
import theFig from 'dxref/models/meta/field-info-generator';
import theFieldInfoUtils from 'dxref/models/meta/field-info-utils';


let FT = FieldConstants.Type;
let FV = FieldConstants.Value;

export default function ContentEditedDro(json) {
	this.initFromJson(json);
}

ContentEditedDro.prototype.initFromJson = function(json) {
	theFieldInfoUtils.validateBasedOnFieldInfo(ContentEditedDro.prototype.meta,json);
	_.assign(this,json);	
	return this;
};

ContentEditedDro.prototype.meta ={
	fieldSet:	theFig.startDefinition()
		/** WORKING HERE to convert addField to the new and improved version. */
		.addField2('id',FT.ID,FV.REQUIRED,false,false)
		.addField2('createdDate',Constants.DATETIME, FV.REQUIRED, false)

		.addField('id',Constants.ID,Constants.REQUIRED,false, false)
		.addField('createdDate',Constants.DATETIME,Constants.REQUIRED,false)
		.addField('updatedDate',Constants.DATETIME,Constants.REQUIRED,false)
		
		.addField('labels',Constants.SET,Constants.REQUIRED)
		.addField('type',Constants.STRING,Constants.OPTIONAL)
			.setRestrictedValues(['comment','insight', 'definition','equivalence'])
		.done()
};