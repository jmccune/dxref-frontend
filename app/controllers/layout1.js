
import Ember from 'ember';
import DecorationAdapter from 'dxref/adapters/adapter-decostore';


var decorationEngine = new DecorationEngine();

function getDecorationsPromise() {
  var decorationAdapter = DecorationAdapter.create();
  
  return decorationAdapter.find("test",123).then(function(data) {

    return "<em> Welcome "+data+" </em><br>  The rest of this is only sample text. <h1> sample title </h1> And other stuff here.  And <em> your stuff </em> here.";
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
      getDecorationsPromise().then(function(data){        
        _this.set('decoratedText',data);     
      })
      
      //Show that we loaded the decoration engine.      
      console.dir(decorationEngine);
    },
    contract: function() {
      this.set('isExpanded', false);
    }
  }
});