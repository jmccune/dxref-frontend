
import DS from 'ember-data';
import Ember from 'ember';


export default DS.RESTAdapter.extend({
   find: function(name, id) {
		console.log("Invoked with: "+name+" id: "+id);

		var promise = Ember.$.getJSON('http://api.randomuser.me/').then(function(data) {			
			console.log("DATA>> ");
			console.dir(data);
			var user = data.results[0].user.name;
			var username = user.title+" "+user.first+" "+user.last;
			return username;
		});

		return promise;
	}
});