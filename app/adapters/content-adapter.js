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

			 console.log("DECORATION SPEC  *B*");
			 console.dir(decorationSpec);
        	 decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        	 console.log("*****>>> DT > "+decoratedText);
        	 return {
        	 	decoratedText: decoratedText
        	 };
		}

		var contentLines=["Nothing to decorate!"];
		decorationSpec = new TextContent2Decorate(contentLines,[]);	
		decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        return {
        	decoratedText: decoratedText
		};		
	}
};


export default adapter;