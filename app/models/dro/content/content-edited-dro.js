
import { dxrefValidator, Constants } from 'dxref/dxref-config';
import theFig from 'dxref/models/meta/field-info-generator';

export default function ContentEditedDro(json) {
	this.initFromJson(json);
}

ContentEditedDro.prototype.initFromJson = function(json) {
	dxrefValidator
		.throwIfNotString("id",json.id,Constants.REQUIRED)
		.throwIfNotString("createdDate",json.createdDate,Constants.REQUIRED)
		.throwIfNotString("updatedDate",json.updatedDate,Constants.REQUIRED)		
		.throwIfNotArray("labels",json.labels,Constants.REQUIRED)
		.throwIfNotString("type",json.type,Constants.OPTIONAL);


	_.assign(this,json);	
	return this;
};

ContentEditedDro.prototype.fieldInfo =
	theFig.startDefinition()
		.addField('id',Constants.ID,Constants.REQUIRED,false, false)
		.addField('createdDate',Constants.DATETIME,Constants.REQUIRED,false)
		.addField('updatedDate',Constants.DATETIME,Constants.REQUIRED,false)
		.addField('labels',Constants.SET,Constants.REQUIRED)
		.addField('type',Constants.STRING,Constants.OPTIONAL)
		.done();


