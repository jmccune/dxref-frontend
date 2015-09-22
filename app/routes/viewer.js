 import Ember from 'ember';

import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';


export default Ember.Route.extend({
  model: function(){

  	// var resolveFn = null;
  	// var promise =  new Ember.RSVP.Promise(function(resolve,reject) {
  	// 	resolveFn = resolve;
  	// });

    
    var item = new listItemModel({ id: 1234, title: "blah", description:"egad"});


    return theDataService.getData(Constants.DXREF_SERVICE,'/contents').then(function(data) {
        console.log("*** DATA *** ");
        console.dir(data);

    });

  	// setTimeout(function(){
  	// 	console.log("*** TIMEOUT WENT!");
  	// 	console.log("resolveFn: "+resolveFn);
  	// 	resolveFn({});
  	// },1000);




   //  return promise;
  }
});