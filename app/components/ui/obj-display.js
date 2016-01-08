import Ember from 'ember';

import { dxrefValidator } from 'dxref/dxref-config';

/**

Usage:  <obj-display model=obj [objectSpec=objectSpec]  [viewSpec=viewSpec]>

*/




export default Ember.Component.extend({
	tagName: 'div',
	renderFieldSpecs:function() {
		var model=this.get('model');
		console.log("MODEL>>>");
		console.dir(model);
		return _.keys(model);
	}.property('baz'),
	didInsertElement: function() {

		var model=this.get('model');
		dxrefValidator.throwIfNotObjectMap('model',model,true);

		var metaInfo = this.get('metaInfo');
		console.dir(metaInfo);
	},
	click: function() {
		this.sendAction();
	}
});
