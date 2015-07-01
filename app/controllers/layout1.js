
import Ember from 'ember';

export default Ember.Controller.extend({

  // initial value
  isExpanded: false,

  actions: {
    toggle: function() {
   	  var isExpanded = this.get('isExpanded');
   	  isExpanded= !isExpanded;
      this.set('isExpanded', isExpanded);
    },

    contract: function() {
      this.set('isExpanded', false);
    }
  }
});