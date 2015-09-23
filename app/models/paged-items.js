import MS from 'dxref/services/model-service';
import { Constants } from 'dxref/dxref-config';

/**

	@param listModelType (OPTIONAL) -- if supplied then all the items
		are converted to the given listModelType when loaded.
*/
export default MS.Model("paged-items",function(listModelType){
	
	var itemType = MS.PropertyType('list',Constants.REQUIRED);
	if (listModelType) {
		itemType = MS.PropertyType('list',Constants.REQUIRED, { elementType: listModelType});
	}
	
	return {
		pageNum: MS.PropertyType('integer',Constants.REQUIRED),
		pageSize: MS.PropertyType('integer',Constants.REQUIRED),
		totalResults: MS.PropertyType('integer',Constants.REQUIRED),
		items: itemType
	};
});