import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import PagedItems from 'dxref/models/paged-items';

export default Ember.Controller.extend({

	actions: {		
		loadNextPage: function(pageInfo) {
			console.log("CONTROLLER NEXT PAGE!"+pageInfo.pageNum);
			this.loadData(pageInfo.pageNum);		
		},
		loadPrevPage: function(pageInfo) {
			console.log("CONTROLLER PREV PAGE!"+pageInfo.pageNum);	
			this.loadData(pageInfo.pageNum);					
		}
	},  
  	loadData:function(pageNum) {
	  	var _this = this;	  	

	    theDataService.getData(Constants.DXREF_SERVICE,'/contents',{pageNum: pageNum}).then(function(data) {
	        var pagedItems = new PagedItems(data,listItemModel);             
	        var newData= pagedItems.adaptForComponent("prevPage","nextPage");
	        console.log("*****>>> ");
	        console.dir(newData);
	        _this.set('model',newData);
	    });	    
	}
});