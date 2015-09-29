import Ember from 'ember';

export default Ember.Object.create({
	currentUrl: null,
	currentPath: null,
	metaCardType: 'cards/empty-card',
	metaInfo: {
		testValue1: 'testValue1'
	},
	relatedDisplayType: 'related/empty-display',
	relatedInfo: {}
});