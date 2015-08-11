import NodeRelationExtraDro from 'dxref/models/dro/NodeRelationExtraDro';

var adapter = {

	convertNreContentToDecoratedContentSpec: function(nreRepsonse) {

		var nre = new NodeRelationExtraDro(nreRepsonse);

		var response = [];
		if (nre.node.length===0) {
			response.append("empty");
		}		
		return new TextContent2Decorate(response);	
	}

};


export default adapter;