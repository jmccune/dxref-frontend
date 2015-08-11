
import Ember from 'ember';

import theDataService from 'dxref/services/data-service';
import theClaimService from 'dxref/adapters/adapter-claimservice';
import {Constants} from 'dxref/dxrefconfig';
import decorationAdapter from 'dxref/adapters/decoration-adapter';

// --- Deprecated --- 
import DecorationAdapter from 'dxref/adapters/adapter-decostore';


var decorationEngine = new DecorationEngine();
var mapFactory = new SimpleHtmlDecoratorFactory();
mapFactory.addDecoratorPrototype("phone",new  HtmlDecorator("phone"));

decorationEngine.setDecoratorFactory(mapFactory);

function getDecoratedTextPromise() {
  var decorationAdapter = DecorationAdapter.create();
  
  return decorationAdapter.find("test",123).then(function(contentBlock) {

      var text = decorationEngine.getDecoratedText(contentBlock);  
      return text;    
  });
  
}


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

      console.log("SERVICE CONSTANTS!");
      console.dir(Constants);

      theDataService.getData(Constants.DXREF_SERVICE,'/content/getRandom').then(function(data) {
        console.log("RECEIVED DATA>> ");
        console.dir(data);
        var decorationSpec = decorationAdapter.convertNreContentToDecoratedContentSpec(data);
        console.dir(decorationSpec);
      });

      //theDataService.getData('dxref-service',)
      // var _this = this;
      // getDecoratedTextPromise().then(function(text){        
      //   _this.set('decoratedText',text);     
      // });
      
      // //Show that we loaded the decoration engine.      
      // console.dir(decorationEngine);
    },
    testFuture:function() {
      console.log("PRESSED BUTTON");
      var _this = this;
      var processingFn = function(data) {
        console.log("******************>> RESOLVED >>>>>>>>>>>"+data);
        _this.set('decoratedText',data);   
      }


      var promise = new Ember.RSVP.Promise(function(resolve,reject) {
        theDataService.getData('dxref-service','/dev/getVContent1').then(function(data) {
          console.log("RECEIVED DATA!");
          console.dir(data);
          if (data.type === 'CLAIM') {
              console.log("Promised good things");
              theClaimService.registerClaimable(data.claimInfo, {resolve:resolve, reject: reject})
          }
          else {
              console.log("RECEIVED THE GOODS!");
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