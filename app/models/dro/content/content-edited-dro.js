import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { ObjectSpecificationBuilder } from 'dxref/core/model/meta/object-specification-builder';
//import { FieldConstants } from 'dxref/utils/field-types';
//import theFig from 'dxref/models/meta/field-info-generator';
//import theFieldInfoUtils from 'dxref/models/meta/field-info-utils';


let FT = FieldConstants.Type;
// let FV = FieldConstants.Value; 

export default function ContentEditedDro(json) {
	this.initFromJson(json);

}

ContentEditedDro.prototype.specification = new ObjectSpecificationBuilder('ContentEditedDro')
	.addField('id',FT.ID, true)
	.addField('createdDate',FT.DATETIME,true)
	.addField('updatedDate',FT.DATETIME,true)
	.addField('labels',FT.SET,true)
	.addField('type',FT.STRING,false)
	.completeObjectSpec();

ContentEditedDro.prototype.getSpecification=function() {
	return this.constructor.prototype.specification;
};


ContentEditedDro.prototype.initFromJson = function(json) {	
	console.log("*******>>> INITIALIZING FROM JSON!"+JSON.stringify(json));
	var objectRep = this.getSpecification().convertToDataMap(json);
	this.getSpecification().throwIfNotValidData(objectRep);

	_.assign(this,objectRep);	
	return this;
};

// ContentEditedDro.prototype.meta ={
// 	fieldSet:	theFig.startDefinition()
// 		/** WORKING HERE to convert addField to the new and improved version. */
// 		//.addField2('id',FT.ID,FV.REQUIRED,false,false)
// 		//.addField2('createdDate',Constants.DATETIME, FV.REQUIRED, false)

// 		.addField('id',Constants.ID,Constants.REQUIRED,false, false)
// 		.addField('createdDate',Constants.DATETIME,Constants.REQUIRED,false)
// 		.addField('updatedDate',Constants.DATETIME,Constants.REQUIRED,false)
		
// 		.addField('labels',Constants.SET,Constants.REQUIRED)
// 		.addField('type',Constants.STRING,Constants.OPTIONAL)
// 			.setRestrictedValues(['comment','insight', 'definition','equivalence'])
// 		.done()
// };