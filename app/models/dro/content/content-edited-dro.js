
import { dxrefValidator, Constants } from 'dxref/dxref-config';
import theFig from 'dxref/models/meta/field-info-generator';
import theFieldInfoUtils from 'dxref/models/meta/field-info-utils';


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
		.addField('id',Constants.ID,Constants.REQUIRED,false, false)
		.addField('createdDate',Constants.DATETIME,Constants.REQUIRED,false)
		.addField('updatedDate',Constants.DATETIME,Constants.REQUIRED,false)
		
		.addField('labels',Constants.SET,Constants.REQUIRED)
		.addField('type',Constants.SET,Constants.OPTIONAL)
			.setRestrictedValues(['comment','insight', 'definition','equivalence'])
		.done()
};


