import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import decorationAdapter from 'dxref/adapters/decoration-adapter';
import theDecorationService from 'dxref/services/decoration-service';

var logger = log4javascript.getLogger('dxref/routes/content/view');

var getOtherNodeId = function(refId, edge){
	if (refId === edge.EN_id) {
		return edge.SN_id;
	} else if (refId===edge.SN_id) {
		return edge.EN_id;
	}
	else {
		logger.error( "Not found: "+refId+" in edge: "+edge.SN_id+"-->"+edge.EN_id);
	}
}

export default Ember.Route.extend({
  model: function(params){

  	var _this= this;
  	return theDataService.getData(Constants.DXREF_SERVICE,'/contents/'+params.content_id)
  	.then(function(data) {

    	var decorationSpec = decorationAdapter.convertNreContentToDecoratedContentSpec(data);
        var decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        
        console.dir(data);

        var myId = data.node.id;

        var links=[];
        _.forEach(data.relations, function(array,key){

        	_.forEach(array,function(edgeInfo){
		    	
		    	var otherId = getOtherNodeId(myId,edgeInfo);
				
				var nodeInfo = data.extraInfo[otherId];
				if (!nodeInfo || !nodeInfo.title) {
		    		//SKIP ANYTHING WITHOUT A TITLE!
		    		return;
		    	}

		    	console.log("KEY "+key);
		    	console.dir(edgeInfo);
		    	console.dir(nodeInfo);

		    	var item = {
		    		title: nodeInfo.title,
		    		description: nodeInfo.description,
		    		link: 'content.view',
		    		id: otherId
		    	};       
		    	links.push(item); 	
        	});
        });

        return {
        	decoratedText: decoratedText,
        	links: links
        };
    });
  }
});