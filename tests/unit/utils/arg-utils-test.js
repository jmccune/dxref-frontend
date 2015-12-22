import argUtils from '../../../utils/arg-utils';
import { FieldConstants } from 'dxref/utils/field-types';
import { module, test } from 'qunit';

module('Unit | Utils | ArgUtils');


function getPersonInterpreter() {
	let FT = FieldConstants.Type;
  	let builder = argUtils.createOrderedArgumentBuilder();
  	return builder.add("name",FT.STRING,true)
  		.add("age", FT.NUMBER,true)
  		.add("male", FT.BOOLEAN, true)
  		.add("ssn" , FT.STRING, false)
  		.build();
}



test('it works', function(assert) {
  
  let personInterpreter= getPersonInterpreter();
  let testFn = function() {
  	var map = personInterpreter.convertToMap(arguments);
  	assert.ok(map!==undefined);
  };

  assert.expect(3);
  testFn("john",35,true, "555-12-1212");
  testFn("john",35,false);
  testFn("john", { age: 35, male: true});

  
});
