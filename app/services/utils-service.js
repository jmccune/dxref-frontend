

var convertMapToArray=function(map) {
	var result=[];
    _.forEach(map,function(value,key){
    	result.push({
    		key: key,
    		value: value
    	});
    });
    return result;
};

export default {
	convertMapToArray: convertMapToArray
};