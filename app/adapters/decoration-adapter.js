import NodeRelationExtraDro from 'dxref/models/dro/node-relation-extra-dro';

var logger = log4javascript.getLogger("dxref.adapters.decoration-adapter");


var adapter = {

	convertNreContentToDecoratedContentSpec: function(nreRepsonse) {

		var nre = new NodeRelationExtraDro(nreRepsonse);

		var response = [];
		if (!nre.node) {
			logger.warn("No response!?");
			response.push(new ContentLine({ content: "NOT FOUND", decorations:[]}));
		}		
		else {
			_.forEach(nre.node.contentLines,function(line) {
				response.push(new ContentLine({ content: line, decorations:[]}));
			});						
		}
		return new TextContent2Decorate(response);	
	}

};


export default adapter;