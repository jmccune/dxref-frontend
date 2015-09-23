import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'button',
	classNames: ['btn'],
	classNameBindings: ['isEnabled::disabled'],
	click: function() {
		this.sendAction();
	}
});
