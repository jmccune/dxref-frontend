

var testUtils = {
	textAnswerContains:function(textAnswer,containsList) {
		var result=true;
		_.forEach([1,2,3],function(v,i) {
			if (!result) {
				return;
			}
			result = (v=== (i+1));
		});
		return result;
	}
};
export default testUtils;
