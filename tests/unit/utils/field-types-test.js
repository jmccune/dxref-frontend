import { FieldConstants, theFieldUtils } from 'dxref/utils/field-types';
import { module, test } from 'qunit';

module('Unit | Utils | FieldUtils');

test('it can validate field types (isValidFieldType)', function(assert) {

	let FCT = FieldConstants.Type;

	// We expect every type in the Type Map to pass...
	assert.expect(_.keys(FCT).length);

	_.forEach(FCT, function(value,key) {
		assert.ok(theFieldUtils.isValidFieldType(value), "Failed on: "+key);				
	});
	
});


test('it can validate the values of a field type', function(assert) {

	let FCT = FieldConstants.Type;

	assert.expect(8);

	assert.ok(theFieldUtils.isValid(FCT.STRING,'this is a string'));
	assert.ok(theFieldUtils.isValid(FCT.STRING,null,false));
	assert.notOk(theFieldUtils.isValid(FCT.STRING,null,true));
	assert.notOk(theFieldUtils.isValid(FCT.STRING,1234));

	assert.ok(theFieldUtils.isValid(FCT.NUMBER,1234));
	assert.ok(theFieldUtils.isValid(FCT.NUMBER,1234.5678));
	assert.notOk(theFieldUtils.isValid(FCT.NUMBER,null,true));
	assert.notOk(theFieldUtils.isValid(FCT.NUMBER,'null',true));

});