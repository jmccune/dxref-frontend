import Ember from 'ember';
import MS from 'dxref/services/model-service';
import { Constants } from 'dxref/dxref-config';

var logger = log4javascript.getLogger('dxref.models.general.list-item-model');

export default MS.Model("listItem",{
	id: MS.PropertyType('id',Constants.REQUIRED),
	title: MS.PropertyType('string',Constants.REQUIRED),
	description: MS.PropertyType('string')
});