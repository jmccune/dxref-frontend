import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		nextPage: function(pageInfo) {						
			this.sendAction('nextPage',pageInfo);											
		},
		prevPage: function(pageInfo) {		
			this.sendAction('prevPage',pageInfo);												
		}
	}
});
