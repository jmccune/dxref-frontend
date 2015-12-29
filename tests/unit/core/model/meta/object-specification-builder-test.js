import { ObjectSpecificationBuilder } from 'dxref/core/model/meta/object-specification-builder';
import { ObjectSpecification } from 'dxref/core/model/meta/object-specification';
import { FieldConstants } from 'dxref/core/model/meta/field-types';
import { module, test } from 'qunit';


module('Unit | Core | Model | Meta | ObjectSpecificationBuilder');

var builder = new ObjectSpecificationBuilder();
var FT = FieldConstants.Type;

var spec = builder
	.addField('a', FT.ID, true).argNum(0)
	.addField('b',FT.STRING, true).argNum(1)
	.addField('c',FT.STRING, false).defaultValue('foo')
	.addField('d',FT.NUMBER, false).displayable().editable().defaultValue(null)
	.addField('e',FT.NUMBER, false).displayable(false).editable(false)
	.completeObjectSpec();

test('it builds the spec as expected', function(assert) {
	
	// console.log("SPEC");
	// console.dir(spec);
	assert.ok(spec instanceof ObjectSpecification);

	// META Verification
	assert.strictEqual(spec._meta.requiredFields.length,2);
	assert.strictEqual(spec._meta.argumentOrder.length,2);
	assert.strictEqual(spec._meta.argumentOrder[0],'a');
	assert.strictEqual(spec._meta.argumentOrder[1],'b');

	assert.strictEqual(spec._meta.defaultValueFields.length,2);
	assert.strictEqual(spec._meta.defaultValueFields[0],'c');
	assert.strictEqual(spec._meta.defaultValueFields[1],'d');


	// All Fields verification...
	assert.strictEqual(_.keys(spec).length,6);

	// TYPE verification
	assert.strictEqual(spec.a.type, FT.ID);
	assert.strictEqual(spec.b.type, FT.STRING);
	assert.strictEqual(spec.c.type, FT.STRING);
	assert.strictEqual(spec.d.type, FT.NUMBER);
	assert.strictEqual(spec.e.type, FT.NUMBER);

	// Required-flag- Verification		
	assert.strictEqual(spec.a.required,true);
	assert.strictEqual(spec.b.required,true);
	assert.strictEqual(spec.c.required,false);
	assert.strictEqual(spec.d.required,false);
	assert.strictEqual(spec.e.required,false);

	// DefaultValue flag verification
	assert.strictEqual(spec.c.defaultValue,'foo');  //DEFAULTS to true
	assert.strictEqual(spec.d.defaultValue,null);	
	assert.strictEqual(spec.e.defaultValue,undefined);	
	// Displayable flag verification
	assert.strictEqual(spec.c.displayable,true);  //DEFAULTS to true
	assert.strictEqual(spec.d.displayable,true);
	assert.strictEqual(spec.e.displayable,false);

	// Editable flag verification
	assert.strictEqual(spec.c.editable,true);  //DEFAULTS to true
	assert.strictEqual(spec.d.editable,true);
	assert.strictEqual(spec.e.editable,false);



});


test('built object specficiation will convert data as expected', function(assert) {

	var dataMap = spec.convertToDataMap('aValue','bValue');
	
	assert.strictEqual(_.keys(dataMap).length,4);
	assert.strictEqual(dataMap.a,'aValue');
	assert.strictEqual(dataMap.b,'bValue');
	assert.strictEqual(dataMap.c,'foo');  // The default value
	assert.strictEqual(dataMap.d,null);   // The default value


	dataMap = spec.convertToDataMap('xaValue','xbValue',{ d: 'bah humbug' });
	console.log("dataMap");
	console.dir(dataMap);
	assert.strictEqual(_.keys(dataMap).length,4);
	assert.strictEqual(dataMap.a,'xaValue');
	assert.strictEqual(dataMap.b,'xbValue');
	assert.strictEqual(dataMap.c,'foo');  // This one we didn't change
	assert.strictEqual(dataMap.d,'bah humbug');   // This one we did.


	dataMap = spec.convertToDataMap('yaValue',{ b: 'ybValue'});
	console.log("dataMap");
	console.dir(dataMap);
	assert.strictEqual(_.keys(dataMap).length,4);
	assert.strictEqual(dataMap.a,'yaValue');
	assert.strictEqual(dataMap.b,'ybValue');
	assert.strictEqual(dataMap.c,'foo'); 
	assert.strictEqual(dataMap.d,null);


	dataMap = spec.convertToDataMap({ a: 'zaValue', b: 'zbValue'});
	assert.strictEqual(_.keys(dataMap).length,4);
	assert.strictEqual(dataMap.a,'zaValue');
	assert.strictEqual(dataMap.b,'zbValue');
	assert.strictEqual(dataMap.c,'foo'); 
	assert.strictEqual(dataMap.d,null);

});
