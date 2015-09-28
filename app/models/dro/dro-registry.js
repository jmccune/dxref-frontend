import NodeRelationExtraDro from 'dxref/models/dro/node-relation-extra-dro';
import ContentElementDro from 'dxref/models/dro/content-element-dro';
import DecorationSetDro from 'dxref/models/dro/decoration-set-dro';
import AnyItemModel from 'dxref/models/any-object-model';

import DxrefError from 'dxref/dxref-errors';

var data = {
	'NodeRelationExtraDto': NodeRelationExtraDro,
	'ContentElementDto' : ContentElementDro,
	'DecorationSetDto'  : DecorationSetDro,
	'SearchResultModel' : AnyItemModel
};


//http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
function newCall(Cls) {
    return new (Function.prototype.bind.apply(Cls, arguments));
    // or even
    // return new (Cls.bind.apply(Cls, arguments));
    // if you know that Cls.bind has not been overwritten
}

var registry = {

	createObject: function(key,jsonModel) {

		if (!data[key]) {
			throw new DxrefError("Unable to find Dro for the particular dto: "+key);
		}

		//Note-- using the object constructor (as below) here fails to create an object
		//  that can be tested with instanceof.   Thus we use Object.create...
		//var createdObject = data[key](jsonModel);
		//var createdObject = Object.create(data[key].prototype);	
		var createdObject = newCall(data[key],jsonModel);

		// if (!createdObject.initFromJson) {
		// 	throw new DxrefError("Dro doesn't have the method 'initFromJson' as required!");
		// }

		// createdObject.initFromJson(jsonModel);
		return createdObject;
	}
};

export default registry;