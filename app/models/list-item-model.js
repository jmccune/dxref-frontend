import Ember from 'ember';
import MS from 'dxref/services/model-service';

var logger = log4javascript.getLogger('dxref.models.general.list-item-model');

//Validator (DXREF-12)
var validator = decorationValidator;
var REQUIRED = true;
var PT = MS.PropertyType;

export default MS.Model({
	id: PT('id'),
	title: PT('string'),
	description: PT('string')
});