import NodeRelationExtraDro from 'dxref/models/dro/node-relation-extra-dro';

var adapter = {

	convertNreContentToDecoratedContentSpec: function(nreRepsonse) {

		var nre = new NodeRelationExtraDro(nreRepsonse);

		var response = [];
		if (!nre.node) {
			response.push(new ContentLine({ content: "NOT FOUND", decorations:[]}));
		}		
		else {
			console.log("NRE>>>");
			console.dir(nre);
		}


		return new TextContent2Decorate(response);	
	}

};


export default adapter;