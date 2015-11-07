

var testUtils = {
	textAnswerContains:function(textAnswer,containsList) {
		var result=true;
		_.forEach(containsList,function(value,i) {
			if (textAnswer.indexOf(value)===-1) {
				console.log("***** MISSING: "+value);
				result=false;
			}
		});
		return result;
	}
};
export default testUtils;
