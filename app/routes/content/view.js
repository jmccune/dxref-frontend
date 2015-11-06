import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';

import relationAdapter from 'dxref/adapters/nre-relation-adapter';
import theContentAdapter from 'dxref/adapters/content-adapter';

import whereComponentModel from 'dxref/components/where/where-model';

/*
var logger = log4javascript.getLogger('dxref/routes/content/view'); 
*/

export default Ember.Route.extend({
  model: function(params){
  
  	return theDataService.getData(Constants.DXREF_SERVICE,'/contents/'+params.content_id)
  	.then(function(data) {
    	 
        var response = theContentAdapter.convertNreResponse(data);        
        
        // Set Where...
        var relationInfo = relationAdapter.adaptRelations(data);
        whereComponentModel.setRelatedInfo(relationInfo);

        return {
          cardData:response,
          metaInfo: [
            { 'label': 'type',
              'value': '',
              'selectionOptions': ['comment','insight', 'definition','equivalence']
            },
            { 'label': 'date created',
              'value': '10/11/2015'
            },
            { 'label': 'date updated',
              'value': '10/23/2015'
            },
            { 'label': 'tags'              
            }
          ]
        };      
    });
  }
});