import Ember from 'ember';

import theDataService from 'dxref/services/data-service';
import {Constants} from 'dxref/dxref-config';

//Interpreting query response...
import listItemModel    from 'dxref/models/list-item-model';
import PagedItems       from 'dxref/models/paged-items';
import ContentEditedDro from 'dxref/models/dro/content/content-edited-dro';


var ContentResource = Ember.Service.extend({
	//'get': function() {},
	'query': function(pageNum) {
		var params={};
		if (pageNum || pageNum===0) {
			params = {pageNum : pageNum};
		}
		return theDataService.getData(Constants.DXREF_SERVICE,'/content', params).
			then(function(response) {
				return new PagedItems(response,listItemModel);				
			});
	},
	'add': function(reference) {
		var postObjectData={};
		if (!reference) {
			reference = null;
		}
		postObjectData={ sourceXref: reference };
		return theDataService.postData(Constants.DXREF_SERVICE,'/content/new',{},postObjectData)
			.then(function(httpResponseInfo) {
				return new ContentEditedDro(httpResponseInfo.response);
			});
	}

});
 
var contentResource = ContentResource.create();
export default contentResource;