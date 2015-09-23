import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		nextPage: function() {			
			var pageInfo = this.get('pagingInfo');
			var isEnabled =  pageInfo.nextEnabled;					
			if (!isEnabled) {
				return;
			}
			pageInfo.set('pageNum',pageInfo.pageNum+1);
			this.sendAction('nextPage',pageInfo);
		},
		prevPage: function() {
			var pageInfo = this.get('pagingInfo');
			var isEnabled =  pageInfo.prevEnabled;					
			if (!isEnabled) {
				return;
			}
			pageInfo.set('pageNum',pageInfo.pageNum-1);
			this.sendAction('prevPage',pageInfo);
		}
	}
});
