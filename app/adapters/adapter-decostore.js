
import DS from 'ember-data';
import Ember from 'ember';


var local={
	adaptContentLine: function(contentLineDto) {
		var decorationModels = [];
		_.forEach(contentLineDto.decorations,function(decorationDtoArray) {
			decorationModels.push(new DecorationModel(decorationDtoArray));
		});

		contentLineDto.decorations = decorationModels;
		return new ContentLine(contentLineDto);
	},	
	adaptToDecorationEngineDomain:function(messageArray) {

		var contentLineArray = [];		
		_.forEach(messageArray,function(value,key){
			contentLineArray.push(local.adaptContentLine(value));
		});

		var textContentBlock = new TextContent2Decorate(contentLineArray);	
		return textContentBlock;
	}
};




export default DS.RESTAdapter.extend({
   find: function(name, id) {
		console.log("Invoked with: "+name+" id: "+id);

		return Ember.$.getJSON('http://localhost:8080/dev/getDecoratedMessage')
					.then(function(data) {			
				// console.log("DATA>> ");
				// console.dir(data);

				var result = local.adaptToDecorationEngineDomain(data);				
				return result;
			});	
	}
});