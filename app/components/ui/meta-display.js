import Ember from 'ember';


/** The TEMPLATE Expects a meta-model that conforms to the following:

fieldMap: {
	"fieldLabel": "fieldModelName"   -- what label to use, what field model to use for that field.
}

*/




export default Ember.Component.extend({
	tagName: 'div',		
	didInsertElement: function() {
		console.log("*** INSERTED ELEMENT!");
		this.set('XYZ','FOO BAR');
		var metaInfo = this.get('metaInfo');
		console.dir(metaInfo);
	},
	click: function() {
		this.sendAction();
	}
});
