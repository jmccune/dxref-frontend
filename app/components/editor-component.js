import Ember from 'ember';

import contentResource from 'dxref/resource/content-resource';

export default Ember.Component.extend({	
	isExpanded:false,
	isLoading:false,
	hasLoaded:false,
	actions: {
		toggle: function() {			
			var isExpanded = this.get('isExpanded');
			isExpanded = !isExpanded;
			this.set('isExpanded',isExpanded);
			console.log("isExpanded: "+isExpanded);
			console.log("isLoading: "+this.get('isLoading'));
			console.log("hasLoaded: "+this.get('hasLoaded'));
			if (isExpanded) {
				this.createNewCommentIfNeeded(isExpanded);
			}
			console.log("isLoading: "+this.get('isLoading'));
			console.log("hasLoaded: "+this.get('hasLoaded'));
		}
	},
	createNewCommentIfNeeded:function(isExpanded) {
		if (isExpanded && !this.get('hasLoaded')) {
			this.set('isLoading',true);
			var _this = this;
			contentResource.add().then(function(result){
				console.log("RECEIVED RESULT!");
				console.dir(result);
				_this.set('isLoading',false);
			});
		}
	},
	
	didInsertElement:function(/*el*/) {		
		console.dir(this);
		var editor = $(this.element).find('.my-editor');
		var toolbar = $(this.element).find('.my-toolbar');

		editor = new wysihtml5.Editor(editor.get(0), {
    			toolbar: toolbar.get(0),
    			parserRules:  wysihtml5ParserRules
  		}); 			
	}
});
