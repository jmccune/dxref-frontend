import MS from 'dxref/services/model-service';
import { Constants } from 'dxref/dxref-config';

// export default MS.Model("paged-items",function(args) {
// 	return {
// 		id: MS.PropertyType('id',Constants.REQUIRED),
// 		title: MS.PropertyType('string',Constants.REQUIRED),
// 		description: MS.PropertyType('string')
// 	};
// });

export default MS.Model("paged-items",{
	
	pageNum: MS.PropertyType('integer',Constants.REQUIRED),
	pageSize: MS.PropertyType('integer',Constants.REQUIRED),
	totalResults: MS.PropertyType('integer',Constants.REQUIRED),
	items: MS.PropertyType('list',Constants.REQUIRED)

});