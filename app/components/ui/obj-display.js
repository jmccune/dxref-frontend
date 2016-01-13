import Ember from 'ember';

import { dxrefValidator } from 'dxref/dxref-config';
import { ObjectSpecificationBasedModel } from 'dxref/core/model/object-specification-based-model';
import { DxrefError } from 'dxref/core/errors/dxref-errors';
import { FieldConstants } from 'dxref/core/model/meta/field-types';
/**

Usage:  <obj-display model=obj [objectSpec=objectSpec]  [viewSpec=viewSpec]>

*/


/** components have renderings --
	READ-ONLY
	EDITABLE
*/

var componentMap ={
	STRING: 	 	  'field-string',  //Short one liner.
	TEXT: 			  'field-text',	   //Larger excerpt  (textarea)
	DATE: 			  'field-date-picker',
};

var humanDefaultMapping = {
	ID:  {  componentName: componentMap.STRING,
			readOnly: true
	},
	STRING:{
			componentName: componentMap.STRING
	},
	DATETIME: {
		componentName: componentMap.DATE,
	},
	SET: {	componentName: componentMap.STRING,
	}
};

var defaultSpecMappingByField = {};

_.forEach(humanDefaultMapping,function(v,k) {
	var newKey = FieldConstants.Type[k];
	if (!newKey) {
		throw new DxrefError('obj-display','**setup**','problems with k,v of: '+k+','+v);
	}
	defaultSpecMappingByField[newKey]=v;
});


export default Ember.Component.extend({
	tagName: 'div',

	getObjectSpec: function() {
		var specification = this.get('objectSpec');
		if (specification) {
			return specification;
		}

		var model=this.get('model');
		if (model instanceof ObjectSpecificationBasedModel) {
			return model.getSpecification();
		}

		throw new DxrefError('ObjectDisplay','getObjectSpec',' Could not derive object specification!');
	},

	generatedFieldSpecifications:function() {
		var objectSpec= this.getObjectSpec();

		var fieldSpecs = [];

		objectSpec.getFields().forEach(function(fieldName){

			var objectFieldSpec = objectSpec[fieldName];
			var fieldType = objectFieldSpec.getType();

			var useFieldSpec = defaultSpecMappingByField[fieldType];
			if (!useFieldSpec) {
				throw new DxrefError('ObjectDisplay','generatedFieldSpecifications',
					' Could not find fieldSpec name: '+fieldName+' type: '+fieldType);
			}

			useFieldSpec = _.clone(useFieldSpec);
			useFieldSpec.objectFieldSpec = objectFieldSpec;

			fieldSpecs.push(useFieldSpec);
		});

		var model=this.get('model');
		//return _.keys(model);

		return fieldSpecs;
	}.property('model'),

	didInsertElement: function() {
		var model=this.get('model');
		dxrefValidator.throwIfNotObjectMap('model',model,true);
		var metaInfo = this.get('metaInfo');
	},
	click: function() {
		this.sendAction();
	}
});
