
import Ember from 'ember';
import DecorationAdapter from 'dxref/adapters/adapter-decostore';
import DataService from 'dxref/services/data-service';

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

var dataService = new DataService();

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
      getDecoratedTextPromise().then(function(text){        
        _this.set('decoratedText',text);     
      });
      
      //Show that we loaded the decoration engine.      
      console.dir(decorationEngine);
    },
    testButton:function() {
      console.log("PRESSED BUTTON");
      dataService.getData('dxref-service','/dev/claimTickets',{tickets:[1,2,3]}).then(function(data) {
          console.log("RECEIVED DATA!");
          console.dir(data);
      });
    },
    contract: function() {
      this.set('isExpanded', false);
    }
  }
});