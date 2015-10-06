import Ember from 'ember';
import {Constants} from 'dxref/dxref-config';
import theDataService from 'dxref/services/data-service';
import listItemModel from 'dxref/models/list-item-model';
import PagedItems from 'dxref/models/paged-items';

export default Ember.Controller.extend({
	init: function() {
		console.log("*** INIT!!");

			
	},
	changed: function() {
		Ember.run.schedule('afterRender',this.afterRender);			  		
	}.observes('model'),
	afterRender:function() {
		console.log("**** AFTER RENDER!");
		var editor = new wysihtml5.Editor('editor', {
    			toolbar: 'toolbar',
    			parserRules:  wysihtml5ParserRules
  		});  
	},
	didInsertElement:function() {
		console.log("*** AFTER INSERT ELEMENT !");
		
		
		
	}
});