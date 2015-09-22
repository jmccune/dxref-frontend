 import Ember from 'ember';

import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import MS from 'dxref/services/model-service';

export default Ember.Route.extend({
  model: function(){

  	// var resolveFn = null;
  	// var promise =  new Ember.RSVP.Promise(function(resolve,reject) {
  	// 	resolveFn = resolve;
  	// });

    return theDataService.getData(Constants.DXREF_SERVICE,'/contents').then(function(data) {
        console.log("*** DATA *** ");
        console.dir(data);
        var items = MS.convertToListOfModels(listItemModel,data);
        console.dir(items);
        _.forEach(items, function(item) {
          console.log("TYPE: "+item.getObjectType());
        });
    });

  	// setTimeout(function(){
  	// 	console.log("*** TIMEOUT WENT!");
  	// 	console.log("resolveFn: "+resolveFn);
  	// 	resolveFn({});
  	// },1000);




   //  return promise;
  }
});