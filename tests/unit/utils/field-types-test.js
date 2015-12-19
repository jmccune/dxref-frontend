import { FieldConstants, theFieldUtils } from 'dxref/utils/field-types';
import { module, test } from 'qunit';

module('Unit | Utils | FieldUtils');

test('it works', function(assert) {

	let FCT = FieldConstants.Type;

	// We expect every type in the Type Map to pass...
	assert.expect(_.keys(FCT).length);

	_.forEach(FCT, function(value,key) {
		assert.ok(theFieldUtils.isValidFieldType(value), "Failed on: "+key);				
	});
	
});