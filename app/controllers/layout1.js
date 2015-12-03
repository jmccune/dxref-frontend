
import Ember from 'ember';

import {Constants} from 'dxref/dxref-config';

import theDataService from 'dxref/services/data-service';
import theDecorationService from 'dxref/services/decoration-service';

import theClaimService from 'dxref/adapters/adapter-claimservice';
import decorationAdapter from 'dxref/adapters/decoration-adapter';


var logger = log4javascript.getLogger('dxref.controllers.layout1');


export default Ember.Controller.extend({

  // initial value
  isExpanded: false,

  actions: {
    toggle: function() {
   	  var isExpanded = this.get('isExpanded');
   	  isExpanded= !isExpanded;
      this.set('isExpanded', isExpanded);         
    },
    getDecoratedText: function() {
      var _this = this;
      theDataService.getData(Constants.DXREF_SERVICE,'/content/getRandom').then(function(data) {
        var decorationSpec = decorationAdapter.convertNreContentToDecoratedContentSpec(data);

        console.log("DECORATION SPEC");
        console.dir(decorationSpec);
        var decoratedText = theDecorationService.getDecoratedText(decorationSpec);
        

        _this.set('decoratedText',decoratedText);  
      });
     
    },
    testFuture:function() {
      
      var _this = this;
      var processingFn = function(data) {
        console.log("******************>> RESOLVED >>>>>>>>>>>"+data);
        _this.set('decoratedText',data);   
      };


      new Ember.RSVP.Promise(function(resolve,reject) {
        theDataService.getData('dxref-service','/dev/getVContent1').then(function(data) {
          if (data.type === 'CLAIM') {
              logger.debug("CLAIM response");
              theClaimService.registerClaimable(data.claimInfo, {resolve:resolve, reject: reject});
          }
          else {              
              logger.debug("DATA response");
              resolve(data.data);
          }
        });

      }).then(processingFn);

    },
    contract: function() {
      this.set('isExpanded', false);
    }
  }
});