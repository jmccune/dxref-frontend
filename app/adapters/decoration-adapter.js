import NodeRelationExtraDro from 'dxref/models/dro/node-relation-extra-dro';
import ContentElementDro from 'dxref/models/dro/content-element-dro';

//var logger = log4javascript.getLogger("dxref.adapters.decoration-adapter");


var adapter = {

	convertNreContentToDecoratedContentSpec: function(nreRepsonse) {
		
		var nre = new NodeRelationExtraDro(nreRepsonse);
 
 		var contentLines = [];
 		var decorations = [];
		if (!nre.node) {
			contentLines.push("Nothing found?!");			
		}		
		else if (!(nre.node instanceof ContentElementDro)) {

			console.log("******");
			console.dir(nre.node);
			contentLines.push(" UNDECORATED CONTENT!");
		}
		else {

			contentLines = nre.node.contentLines;

			_.forEach(nre.extraInfo, function(value /*, id*/) {				
				if (value.decorations) {
					decorations = decorations.concat(value.decorations);
				}
			});
		}
		return new TextContent2Decorate(contentLines,decorations);	
	}

};


export default adapter;