 import Ember from 'ember';

import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import MS from 'dxref/services/model-service';

export default Ember.Route.extend({
  model: function(){

    return theDataService.getData(Constants.DXREF_SERVICE,'/contents').then(function(data) {
        var items = MS.convertToListOfModels(listItemModel,data);
        var response = {
          items: items,
          howdy: "hello justin"
        };
        console.log("RESPONSE>> ");
        console.dir(response);
        return response;
    });
  }
});