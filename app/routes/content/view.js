import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import decorationAdapter from 'dxref/adapters/decoration-adapter';
import theDecorationService from 'dxref/services/decoration-service';

export default Ember.Route.extend({
  model: function(params){

  	var _this= this;
  	return theDataService.getData(Constants.DXREF_SERVICE,'/contents/'+params.content_id)
  	.then(function(data) {

    	var decorationSpec = decorationAdapter.convertNreContentToDecoratedContentSpec(data);
        var decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        _this.set('decoratedText',decoratedText);  
        return {
        	decoratedText: decoratedText
        };
    });

  	//return theDataService.simulateDelayedResponse(1000,{});

  }
});