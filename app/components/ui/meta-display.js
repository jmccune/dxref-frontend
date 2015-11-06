import Ember from 'ember';


/** The TEMPLATE Expects a meta-model that conforms to the following:

fieldMap: {
	"fieldLabel": "fieldModelName"   -- what label to use, what field model to use for that field.
}

*/




export default Ember.Component.extend({
	tagName: 'div',		
	click: function() {
		this.sendAction();
	}
});
