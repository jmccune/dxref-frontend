import Ember from 'ember';

import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import PagedItems from 'dxref/models/paged-items';
import whereComponentModel from 'dxref/components/where/where-model';

export default Ember.Route.extend({
  model: function(){
    var pageNum = this.get('pageNum');
    if (!pageNum) {
      this.set('pageNum',0);
      pageNum = 0;
    }    

    whereComponentModel.setMetaMessage("Searching for any textual content/excerpts we can find!");
    whereComponentModel.setRelatedInfo(null);

    return theDataService.getData(Constants.DXREF_SERVICE,'/contents').then(function(data) {
        var pagedItems = new PagedItems(data,listItemModel);
        return pagedItems.adaptForComponent("prevPage","nextPage");
    });
  }
});