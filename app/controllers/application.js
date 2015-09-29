import Ember from 'ember';
import whereComponentModel from 'dxref/components/where/where-model';

export default  Ember.Controller.extend({
  currentPathDidChange: function() {
    var path = this.get('currentPath');
    console.log('path changed to: ', path); 
    console.log("WINDOW URL "+window.location);   
    whereComponentModel.set('currentUrl',window.location);
    whereComponentModel.set('currentPath',path);
  }.observes('currentPath')
});