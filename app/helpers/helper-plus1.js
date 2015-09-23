import Ember from 'ember';

/** This is going away? What's replacing it? */
export default Ember.Handlebars.makeBoundHelper(function(params) {	
	if (typeof params === 'number') {
		params = params+1;
	}
	return params;
});
