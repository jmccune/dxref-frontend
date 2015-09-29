import Ember from 'ember';

export default Ember.Object.create({
	currentUrl: null,
	currentPath: null,
	metaCardType: 'cards/empty-card',
	metaInfo: {},		
	relatedDisplayType: 'related/empty-display',
	relatedInfo: {},


	setMetaMessage: function(msg) {
		if (!msg) {
			this.setProperties({
				metaCardType:'cards/empty-card',
				metaInfo: {}
			});			
		}
		else {
			this.setProperties({
				metaCardType:'cards/message-card',
				metaInfo: {
					message: msg
				}
			});
		}
	},
	setRelatedInfo: function(data) {
		if (!data) {
			this.setProperties({
				relatedDisplayType:'related/empty-display',
				relatedInfo: {}
			});
			
		}
		else {
			this.setProperties({
				relatedDisplayType:'related/related-nodes-display',
				relatedInfo:data			
			});
		}
	}
});