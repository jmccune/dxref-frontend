
import Ember from 'ember';
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
      var _this = this;
      getDecoratedTextPromise().then(function(text){        
        _this.set('decoratedText',text);     
      });
      
      //Show that we loaded the decoration engine.      
      console.dir(decorationEngine);
    },
    contract: function() {
      this.set('isExpanded', false);
    }
  }
});