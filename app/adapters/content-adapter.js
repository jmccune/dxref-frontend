import decorationAdapter from 'dxref/adapters/decoration-adapter';
import theDecorationService from 'dxref/services/decoration-service';

import NodeRelationExtraDro from 'dxref/models/dro/node-relation-extra-dro';
import ContentElementDro from 'dxref/models/dro/content-element-dro';

var adapter = {

	convertNreResponse: function(nreResponse) {
		
		if (!nreResponse) {
			throw "Not a valid nreResponse!";
		}
		var nre = new NodeRelationExtraDro(nreResponse);
		if (!nre || !nre.node) {
			throw "Not able to extract information>> Not a valid nreResponse!";
		} 

		var decorationSpec=null;
		var decoratedText=null;
		if (nre.node instanceof ContentElementDro) {
			 decorationSpec = decorationAdapter.convertNreContentToDecoratedContentSpec(nreResponse);
			 decoratedText = theDecorationService.getDecoratedText(decorationSpec);        	 
        	 return {
        	 	cardType: 'cards/message-card',
        	 	rawHtml: true,
        	 	message: decoratedText        	 	
        	 };
		}

		console.log("NON_DECORATED TEXT: ");
		console.dir(nre.node);

		var node = nre.node;
		if (node.title && node.id && node.graphTypes) {

			var baseResponse = {
        		cardType: 'cards/source-card',
        		title: node.title,
        		description: node.description,
			};		

			if (node.graphTypes.indexOf("SourceInfo")>=0) {
				baseResponse.type="SourceInfo";
				baseResponse.url =node.url;
				baseResponse.sourceTypes=node.sourceTypes;
			}

			return baseResponse;
		}

		var contentLines=["Nothing to decorate!"];
		decorationSpec = new TextContent2Decorate(contentLines,[]);	
		decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        return {
        	cardType: 'cards/source-card',
        	title: "ERROR>>> Unknown...",
        	description: "An error occurred-- couldn't figure out what the response was!"
		};		
	}
};


export default adapter;