import theUtils from 'dxref/services/utils-service';
var logger = log4javascript.getLogger('dxref/adapters/nre-relation-adapter');

var getOtherNodeId = function(rootIds, edge){
	for (var i=0; i<rootIds.length; i++) {
		var refId = rootIds[i];
		if (refId === edge.EN_id) {
			return edge.SN_id;
		} else if (refId===edge.SN_id) {
			return edge.EN_id;
		}
	}	
	logger.warn( "Not found: "+refId+" in edge: "+edge.SN_id+"-->"+edge.EN_id);	
	return null;
};


var rnIncrement=function(idCountMap, id, rootIds) {

	var count = idCountMap[id];
	if (!count) {
		count=0;
	}
	count++;
	if (count>1) {
		if (rootIds.indexOf(id)==-1) {
			rootIds.push(id);	
		}
	}
	idCountMap[id] = count;
		
}

var adapter = {

	/** Because of proxying, the related nodes may actually return 
		nodes related to A & B    where B is what A is proxying or
		slicing some of the information for.  This routine finds
		the alternate node that might be "the Other Id". */
	findRootNodes: function(nreData, rootNode) {
		var idCountMap={};
		var rootIds=[rootNode];
		 _.forEach(nreData.relations, function(array,key){
        	_.forEach(array,function(edge){
        		var startId = edge.SN_id;
        		var endId = edge.EN_id;
        		rnIncrement(idCountMap,startId,rootIds);
        	});
        });
		console.log("ROOT IDS FOUND: ");
		console.dir(rootIds);
		return rootIds;
	},
	adaptRelations: function(nreData) {

		var relations = nreData.relations;
		var myId = nreData.node.id;
		var edgeTypeMap={};       

		var rootIds = this.findRootNodes(nreData,myId);

        _.forEach(relations, function(array,key){

        	_.forEach(array,function(edgeInfo){
		    	
		    	var otherId = getOtherNodeId(rootIds,edgeInfo);
				console.log("OTHER ID: "+otherId);
				var nodeInfo = nreData.extraInfo[otherId];
				console.log("KEY "+key);
		    	console.dir(edgeInfo);
		    	console.dir(nodeInfo);

				if (!nodeInfo || !nodeInfo.title) {
		    		//SKIP ANYTHING WITHOUT A TITLE!
		    		return;
		    	}

		    	var edgeType = edgeInfo.edgeType;
		    	var linkList = edgeTypeMap[edgeType];
		    	if (!linkList) {
		    		linkList = [];
					edgeTypeMap[edgeType] = linkList;
		    	}

		    	var graphTypes =nodeInfo.graphTypes;
		    	if (!graphTypes) {
		    		graphTypes =[];
		    	}

		    	var item = {
		    		title: nodeInfo.title,
		    		description: nodeInfo.description,
		    		link: 'content.view',
		    		types: graphTypes,
		    		id: otherId
		    	};       
		    	linkList.push(item); 	
        	});
        });

        
		var linkGroups = theUtils.convertMapToArray(edgeTypeMap);

		return linkGroups;
	}

};


export default adapter;