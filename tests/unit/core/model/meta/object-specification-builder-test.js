import { ObjectSpecificationBuilder } from 'dxref/core/model/meta/object-specification-builder';
import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { module, test } from 'qunit';


module('Unit | Core | Model | Meta | ObjectSpecificationBuilder');

test('it builds the spec as expected', function(assert) {
	
	var builder = new ObjectSpecificationBuilder();
	var FT = FieldConstants.Type;

	var spec = builder
		.addField('a', FT.ID, true).argNum(0)
		.addField('b',FT.STRING, true).argNum(1)
		.addField('c',FT.STRING, false)
		.completeObjectSpec();

	console.log("SPEC");
	console.dir(spec);
	assert.equal(spec._meta.requiredFields.length,2);
	assert.equal(spec._meta.argumentOrder.length,2);
	assert.equal(spec._meta.argumentOrder[0],'a');
	assert.equal(spec._meta.argumentOrder[1],'b');
	assert.equal(_.keys(spec).length,4);
	assert.equal(spec.a.type, FT.ID);
	assert.equal(spec.b.type, FT.STRING);
	assert.equal(spec.c.type, FT.STRING);
	assert.equal(spec.a.required,true);
	assert.equal(spec.b.required,true);
	assert.equal(spec.c.required,false);


	
});