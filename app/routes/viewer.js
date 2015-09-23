 import Ember from 'ember';

import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import PagedItems from 'dxref/models/paged-items';
import MS from 'dxref/services/model-service';


export default Ember.Route.extend({
  model: function(){

    return theDataService.getData(Constants.DXREF_SERVICE,'/contents').then(function(data) {

        var pagedItems = new PagedItems(data);

        pagedItems.items = MS.convertToListOfModels(listItemModel,pagedItems.items);
        var response = {
          items: pagedItems.items          
        };        
        return response;
    });
  }
});