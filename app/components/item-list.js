import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		nextPage: function(pageInfo) {			
			console.log(" ITEM-LIST >> NEXT PAGE");
			console.dir(pageInfo);
			this.sendAction('nextPage',pageInfo);											
		},
		prevPage: function(pageInfo) {
			console.log(" ITEM-LIST >> PREV PAGE");
			this.sendAction('prevPage',pageInfo);												
		},
		test: function() {
			console.log("ITEM -list >> TEST");
		}
	}
});
