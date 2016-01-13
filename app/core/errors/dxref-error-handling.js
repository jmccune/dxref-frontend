import { DxrefError } from 'dxref/core/errors/dxref-errors';
import Ember from 'ember';

var logger = log4javascript.getLogger('dxref.core.errors.dxref-error-handling');



function DefaultErrorHandler(exception, url, line) {

	// True only of browser caught exceptions
	if (url || line) {
		logger.error("Error occurred: "+url+" >>line: "+line);
	}

	//Usually Ember gives us the actual exception -- which we hope will be a DxrefError...
	if (exception instanceof DxrefError) {
		var actualMessage = exception.getFullErrorMessage();
		logger.error(actualMessage);
	}
	else {
		logger.error("Unhelpful>> "+exception);
	}
	return false;
}

export var DxrefErrorHandler = {

	initialize:function() {

		window.onerror = DefaultErrorHandler;
		Ember.onerror= DefaultErrorHandler;
	}
};


