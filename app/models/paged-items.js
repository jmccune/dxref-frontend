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

x.prototype.humanReadableVersion=function() {	

    var startIndex = this.pageNum * this.pageSize +1;
    var endIndex = startIndex+ this.pageSize-1;
    if (endIndex > this.numResults) {
    	endIndex = this.numResults;
    }        
	return {
		pageNum: this.pageNum+1,
		numResults: this.numResults,
		pageSize: this.pageSize,
		startIndex: startIndex,
		endIndex: endIndex,
		items: this.items
	};
};

export default x;