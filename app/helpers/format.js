import Ember from 'ember';

export function format(params/*, hash*/) {
	console.log("FORMAT>>>");
	console.dir(params);
  return params;
}

export default Ember.Helper.helper(format);
