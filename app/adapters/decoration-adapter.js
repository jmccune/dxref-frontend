import NodeRelationExtraDro from 'dxref/models/dro/node-relation-extra-dro';

var logger = log4javascript.getLogger("dxref.adapters.decoration-adapter");


var adapter = {

	convertNreContentToDecoratedContentSpec: function(nreRepsonse) {
		
		var nre = new NodeRelationExtraDro(nreRepsonse);
 
 		var contentLines = [];
 		var decorations = [];
		if (!nre.node) {
			contentLines.push("Nothing found?!");			
		}		
		else {
			contentLines = nre.node.contentLines;

			_.forEach(nre.extraInfo, function(value, id) {				
				if (value.decorations) {
					decorations = decorations.concat(value.decorations);
				}
			});
		}
		return new TextContent2Decorate(nre.node.contentLines,decorations);	
	}

};


export default adapter;