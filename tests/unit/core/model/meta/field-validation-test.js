import { FieldConstants } from 'dxref/core/model/meta/field-types';
import theFieldValidator from 'dxref/core/model/meta/field-validation';

import { module, test } from 'qunit';

module('Unit | Core | Model | Meta | FieldValidator');

test('it can validate field types (isValidFieldType)', function(assert) {

	let FCT = FieldConstants.Type;

	// We expect every type in the Type Map to pass...
	assert.expect(_.keys(FCT).length);

	_.forEach(FCT, function(value,key) {
		assert.ok(theFieldValidator.isValidFieldType(value), "Failed on: "+key);				
	});
	
});

test('it will validate correct field type values',function(assert) {

	var validMap = {
		'ID': ['12345', 12345],
		'STRING': ['Blah','foo', 'a','could be a very long sentence'],
		'DATETIME': ['2015-12-31T16:39:00Z'],
		'LIST'  : [ ['a','b','c','c','b','a'],[] ],
		'SET'   : [ ['a','b','c'] ],
		'NUMBER': [ 12345, 12345.6789, -54321, -54321.0, 0],
		'BOOLEAN': [ true,false],
		'OBJECT' : [ {}, { a: 123}],
		'ANY'    : [ 'abc', 12345, { a: 1234}, true, [ 'x', 'y',123]],
		'MAP_OR_LIST' : [ {}, [], { a: 1234}, [12345], {a:'a', b:'b'}, ['a','b','c']],
		'FUNCTION' : [ function() {return true;}],
		'NAMED_FUNCTION': [ 'fooFn' ]
	};

	let FCT = FieldConstants.Type;
	var testKeys = _.keys(validMap);
	assert.equal(testKeys.length, _.keys(FCT).length);

	testKeys.forEach(function(key) {
		var testValues = validMap[key];
		var fieldType = FCT[key];
		testValues.forEach(function(validFieldValue){
			var isValid = theFieldValidator.isValid('testField',fieldType,validFieldValue,true);
			if (!isValid) {
				console.log("Did not correctly evaluate to (VALID) on: "+key+" "+fieldType+">> "+validFieldValue);
			}
			assert.equal(isValid,true);
		});
	});

});

test('it will invalidate incorrect field type values',function(assert) {

	// Example of all the basic types (excluding function)
	// 'blah', 'b', 12345, -12345.678,true, false, null, undefined, { a:1234}, ['a','b'] 
	var invalidMap = {
		'ID': [ { a: 123}, ['a'], true, false],
	    'STRING': [12345, -12345.678,true, false, null, undefined, { a:1234}, ['a','b'] ],
	    'DATETIME': ['blah', 'b', 12345, -12345.678,true, false, null, undefined, { a:1234}, ['a','b'] ],
		'LIST'  : [ 12345, -12345.678,true, false, null, undefined, { a:1234} ],
		'SET'   : [ ['a','b','c', 'c', 'c'] , 12345, -12345.678,true, false, null, undefined, { a:1234}],
		'NUMBER': [ 'blah', 'b',true, false, null, undefined, { a:1234}, ['a','b']],
		'BOOLEAN': [  0, '','blah', 'b', 12345, -12345.678, null, undefined, { a:1234}, ['a','b']],
		'OBJECT' : [  'blah', 'b', 12345, -12345.678,true, false, null, undefined, ['a','b'] ],
		'ANY'    : [ ],  //NOTE  ANY means there is nothing that is invalid.

		'MAP_OR_LIST' : ['blah', 'b', 12345, -12345.678,true, false, null, undefined ],
		'FUNCTION' : [ 'blah', 'b', 12345, -12345.678,true, false, null, undefined, { a:1234}, ['a','b']  ],
		'NAMED_FUNCTION': [ 12345, -12345.678,true, false, null, undefined, { a:1234}, ['a','b']  ]
	};

	let FCT = FieldConstants.Type;
	var testKeys = _.keys(invalidMap);
	assert.equal(testKeys.length, _.keys(FCT).length);

	testKeys.forEach(function(key) {
		var testValues = invalidMap[key];
		var fieldType = FCT[key];
		testValues.forEach(function(validFieldValue){
			var isValid = theFieldValidator.isValid('testField',fieldType,validFieldValue,true);
			if (isValid) {
				console.log("Did not correctly evaluate to (INVALID) ON: "+key+" "+fieldType+">> "+validFieldValue);
			}
			assert.equal(isValid,false);
		});
	});

});