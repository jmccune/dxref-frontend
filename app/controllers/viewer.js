import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import PagedItems from 'dxref/models/paged-items';
import MS from 'dxref/services/model-service';

export default Ember.Controller.extend({

	actions: {		
		loadNextPage: function(pageInfo) {
			console.log("CONTROLLER NEXT PAGE!"+pageInfo.pageNum);

		},
		loadPrevPage: function(pageInfo) {
			console.log("CONTROLLER PREV PAGE!"+pageInfo.pageNum);			
		}
	},  
  	loadData:function() {
	  	var pageNum = this.get('pageNum');
	    return theDataService.getData(Constants.DXREF_SERVICE,'/contents').then(function(data) {
	        var pagedItems = new PagedItems(data,listItemModel);             
	        return pagedItems.adaptForComponent("prevPage","nextPage");
	    });
	}
});