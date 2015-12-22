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

test('it validates as expected', function(assert) {
  
  let personInterpreter= getPersonInterpreter();
  let testFn = function() {
  	var answerMap= arguments[arguments.length-1];
  	var args = Array.prototype.slice.call(arguments, 0, arguments.length-1);
  	var resultMap = personInterpreter.convertToMap.apply(personInterpreter,args);
  	
  	assert.ok(_.isEqual(resultMap,answerMap));
  };

  let errorTestFn=function() {
  	var expectedErrorMessage = arguments[arguments.length-1];  	
  	var args = Array.prototype.slice.call(arguments, 0, arguments.length-1);
  	console.dir(args);
  	assert.throws(function() { 
  		personInterpreter.convertToMap.apply(personInterpreter,args);
  	},function(actualError) {  
  		var result=(actualError===expectedErrorMessage);

  		if (!result) {
  			console.log("EXPECTED:>>"+expectedErrorMessage+"<<");
  			console.log("ACTUAL:  >>"+actualError+"<<");
  		}

  		return result;
  	});  
  };

  assert.expect(6);

  var answer = {
  		name: 'john',
  		age: 35,
  		male: true,
  		ssn: '555-12-1212'
  };
  testFn("john",35,true, "555-12-1212", answer);

  //Tweak answer for test #2
  delete answer.ssn;
  answer.male=false;
  testFn("john",35,false, answer);

  //Tweak again for test #3
  answer.male=true;
  testFn("john", { age: 35, male: true}, answer);
 
 
  errorTestFn(35,35,true,'OrderedArgumentInterpreter>> given value of: 35 for parameter: name is not valid!');
  errorTestFn("john","doe",true,'OrderedArgumentInterpreter>> given value of: doe for parameter: age is not valid!');
  errorTestFn("john",35,1234,'OrderedArgumentInterpreter>> given value of: 1234 for parameter: male is not valid!');
});
