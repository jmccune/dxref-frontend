import Ember from 'ember';

import contentResource from 'dxref/resource/content-resource';
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

        return contentResource.query().then(function(pagedItems) {
            return pagedItems.adaptForComponent("prevPage","nextPage");
        });
    }
});