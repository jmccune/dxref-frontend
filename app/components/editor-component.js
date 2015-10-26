import Ember from 'ember';

export default Ember.Component.extend({	
	isExpanded:false,
	actions: {
		toggle: function() {			
			var isExpanded = this.get('isExpanded');
			isExpanded = !isExpanded;
			this.set('isExpanded',isExpanded);
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
