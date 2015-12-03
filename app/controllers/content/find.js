import Ember from 'ember';

import contentResource from 'dxref/resource/content-resource';

export default Ember.Controller.extend({

	actions: {		
		loadNextPage: function(pageInfo) {
			//console.log("CONTROLLER NEXT PAGE!"+pageInfo.pageNum);
			this.loadData(pageInfo.pageNum);		
		},
		loadPrevPage: function(pageInfo) {
			//console.log("CONTROLLER PREV PAGE!"+pageInfo.pageNum);	
			this.loadData(pageInfo.pageNum);					
		}
	},  
  	loadData:function(pageNum) {
	  	var _this = this;	  	

	  	contentResource.query(pageNum).then(function(pagedItems){
	  		var newData= pagedItems.adaptForComponent("prevPage","nextPage");
	        _this.set('model',newData);
	  	});	    
	}
});