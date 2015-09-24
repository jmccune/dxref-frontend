import MS from 'dxref/services/model-service';
import { Constants } from 'dxref/dxref-config';

/**

	@param listModelType (OPTIONAL) -- if supplied then all the items
		are converted to the given listModelType when loaded.
*/
var x =MS.Model("paged-items",function(listModelType){
	
	var itemType = MS.PropertyType('list',Constants.REQUIRED);
	if (listModelType) {
		itemType = MS.PropertyType('list',Constants.REQUIRED, { elementType: listModelType});
	}

	return {
		pageNum: MS.PropertyType('integer',Constants.REQUIRED),
		pageSize: MS.PropertyType('integer',Constants.REQUIRED),
		numResults: MS.PropertyType('integer',Constants.REQUIRED),
		items: itemType
	};
});

x.prototype.adaptForComponent=function(prevAction,nextAction) {	

    var startIndex = this.pageNum * this.pageSize;
    var endIndex = startIndex+ this.pageSize-1;
    if (endIndex > this.numResults) {
    	endIndex = this.numResults-1;
    }        

    _.forEach(this.items, function(item) {
    	item.link = 'content.view'
    });
	return Ember.Object.create({

		pageNum: this.pageNum,
		numResults: this.numResults,
		pageSize: this.pageSize,
		items: this.items,

		//inferred		
		startIndex: startIndex,
		endIndex: endIndex,		
		prevEnabled: this.pageNum>0,
		nextEnabled : (this.pageNum+1)*this.pageSize < this.numResults,
		prevPage: prevAction,
		nextPage: nextAction
	});
};

export default x;