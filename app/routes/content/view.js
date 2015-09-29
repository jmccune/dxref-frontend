import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import theDecorationService from 'dxref/services/decoration-service';

import decorationAdapter from 'dxref/adapters/decoration-adapter';
import relationAdapter from 'dxref/adapters/nre-relation-adapter';

import whereComponentModel from 'dxref/components/where/where-model';

var logger = log4javascript.getLogger('dxref/routes/content/view');


export default Ember.Route.extend({
  model: function(params){
  
  	return theDataService.getData(Constants.DXREF_SERVICE,'/contents/'+params.content_id)
  	.then(function(data) {

    	var decorationSpec = decorationAdapter.convertNreContentToDecoratedContentSpec(data);
        var decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        
        var relationInfo = relationAdapter.adaptRelations(data);

        whereComponentModel.setRelatedInfo(relationInfo);

        

       	var linkGroups = relationInfo;
        console.log("*** EDGETYPE MAP ****");
        console.dir(linkGroups);
        return {
        	decoratedText: decoratedText,
        	linkGroups: linkGroups
        };
    });
  }
});