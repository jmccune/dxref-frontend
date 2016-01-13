import Ember from 'ember';

export function toJson(data) {
	console.log("TOJSON>>>");
	console.dir(data[0]);
	return 'JSON Value>>'+JSON.stringify(data[0])+'<<';

}

export default Ember.Helper.helper(toJson);
