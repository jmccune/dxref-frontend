import Ember from 'ember';

export default Ember.Controller.extend({

	actions: {
		test: function() {
			console.log("USER PRESSED TEST VIEW BUTTON!");
			console.dir(this);
		}
	}


});