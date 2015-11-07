var textContains = function(text,snippetList) {
		var result=true;
		_.forEach(snippetList,function(value,i) {
			if (text.indexOf(value)===-1) {
				console.log("***** MISSING: "+value);
				result=false;
			}
		});
		return result;
	};

var testUtils = {
	textContains: function(text,snippetList,ignoreWhiteSpaceDifferences) {
		if (ignoreWhiteSpaceDifferences) {
			var regex = /\s+/g;
			text = text.replace(regex," ");
			snippetList = _.transform(snippetList,function(r,v) {
				r.push(v.replace(regex," "));
			});			
		}
		return textContains(text,snippetList);
	}
};
export default testUtils;
