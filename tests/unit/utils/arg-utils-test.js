import argUtils from '../../../utils/arg-utils';
import { FieldConstants } from 'dxref/utils/field-types';
import { module, test } from 'qunit';

module('Unit | Utils | ArgUtils');

// Replace this with your real tests.
test('it works', function(assert) {
  
  let FT = FieldConstants.Type;
  let builder = argUtils.createOrderedArgumentBuilder();
  builder.add("name",FT.STRING,true)
  		 .add("age", FT.NUMBER,true)
  		 .add("male", FT.BOOLEAN, true)
  		 .add("ssn" , FT.STRING, false);

 
  assert.expect(0);
});
