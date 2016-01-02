import Ember from 'ember';
import { module, test } from 'qunit';
import { ErrorHandlingPromise } from 'dxref/core/error-handling-promise';

module('Unit | Core | ErrorHandlingPromise');


/** Changing this flag changes whether we return the NORMAL Ember Promise
    vs. returning the wrapped ErrorHandlingPromise.   Tests that use the
    defaultCatchHandler are ignored if not using the error handling promise. */
var USE_ERROR_HANDLING_PROMISE = true;

var generateAsyncProcessMock=function() {
	var simulatedAsyncProcess = {
		resolveFn: null,
		rejectFn: null,
		setResponse:function(success,data) {
			if (success) {
				this.resolveFn(data);
			}
			else {
				this.rejectFn(data);
			}
		}
	};

	return simulatedAsyncProcess;
};


var generatePromise=function(simulatedAsyncProcess) {
	var promise=  new Ember.RSVP.Promise(function(resolve,reject) {
		simulatedAsyncProcess.resolveFn = resolve;
		simulatedAsyncProcess.rejectFn = reject;
	});	

	if (!USE_ERROR_HANDLING_PROMISE) {
		return promise;
	}

	var ePromise = new ErrorHandlingPromise(promise);
	return ePromise;
};

var generateResponseFn=function(logObject,tagForFnCalled,throwMessage, xformedResponse) {
	return function(x) {	
		logObject.logCalls+='>'+tagForFnCalled+'('+JSON.stringify(x)+')';
		if (throwMessage) {
			throw throwMessage;
		}
		if (xformedResponse) {
			return xformedResponse;
		}
		if (x) {
			return x;
		}
	};
};


/** Demonstrates how testing normally works. */
test('validate basic promises', function(assert) {

	var asyncProcess = generateAsyncProcessMock();
	var promise = generatePromise(asyncProcess);
	var done = assert.async();
	var logObject={
		logCalls : 'VBP0>'
	};

	promise.then(generateResponseFn(logObject,'success0'),
			 	 generateResponseFn(logObject,'reject0'));
	
	assert.strictEqual(logObject.logCalls,'VBP0>');
	asyncProcess.setResponse(true,'boogey');

	setTimeout(function() {		
		assert.strictEqual(logObject.logCalls,'VBP0>>success0(\"boogey\")');				
		done();
	},100);
});

var testHarnessFn = function(assert,testLabel,asyncResponseData,successVerificationFn) {

	var asyncProcess = generateAsyncProcessMock();
	var promise = generatePromise(asyncProcess);
	var done = assert.async();
	var logObject={
		logCalls : testLabel+'>'
	};


	setTimeout(function(){		
		asyncProcess.setResponse(asyncResponseData.success,asyncResponseData.data);		
	}, 30);

	setTimeout(function() {		
		successVerificationFn(logObject.logCalls);
		done();
	},100);

	return {
		promise: promise,
		logObject: logObject
	};
};

/** The harness makes the test more succinct abstracting away the common details. */
test('validate basic promises w/harness', function(assert) {

	var testData = testHarnessFn(assert,'VBPwH0',{success: true, data: 'foo'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'VBPwH0>>success0(\"foo\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0'));

});

/**  GOOD Ajax Response, the (SUCCESS) handler handles and then the following SUCCESS handler also runs
	(This is usually how we want these things to work... -- e.g. success of A then success of B)
 */
test('validate basic promises chained success 1', function(assert) {

	var testData = testHarnessFn(assert,'Chain1',{success: true, data: 'chain1'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'Chain1>>success0(\"chain1\")>success1(\"chain1\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0'))
				.then(generateResponseFn(lo,'success1'),
					  generateResponseFn(lo,'reject1'));

});

/**  BAD Ajax Response, the (ERROR) handler handles and then the following then clause continues on its way...  */
test('validate basic promises chained reject 1', function(assert) {

	var testData = testHarnessFn(assert,'Chain1',{success: false, data: 'chain1'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'Chain1>>reject0(\"chain1\")>success1(\"chain1\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0'))
				.then(generateResponseFn(lo,'success1'),
					  generateResponseFn(lo,'reject1'));

});

/**  BAD Ajax Response, the (ERROR) handler handles and then throws an error, the following error handler picks up. */
test('validate basic promises chained reject 1 & 2', function(assert) {

	var testData = testHarnessFn(assert,'Chain1-2',{success: false, data: 'chain1-2'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'Chain1-2>>reject0(\"chain1-2\")>reject1(\"error0\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0','error0'))
				.then(generateResponseFn(lo,'success1'),
					  generateResponseFn(lo,'reject1'));

});


/**  Successful Ajax Response, the (SUCCESS) handler throws an error, the following error handler picks up. */
test('validate basic promises S1R2', function(assert) {

	var testData = testHarnessFn(assert,'S1R2',{success: true, data: 's1r2'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'S1R2>>success0(\"s1r2\")>reject1(\"error0\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0','error0'),
						  generateResponseFn(lo,'reject0'))
					.then(generateResponseFn(lo,'success1'),
						  generateResponseFn(lo,'reject1'));

});


/**  Successful Ajax Response, the (SUCCESS) handler throws an error, the following CATCH handler picks up. */
test('validate basic promises S1C0', function(assert) {

	var testData = testHarnessFn(assert,'S1C0',{success: true, data: 's1c0'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'S1C0>>success0(\"s1c0\")>catch1(\"error0\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0','error0'),
						  generateResponseFn(lo,'reject0'))
					.catch(generateResponseFn(lo,'catch1'));
						  
});

/**  Successful Ajax Response, the (SUCCESS) handler throws an error, the following error handler picks up. */
test('validate basic promises S1C1', function(assert) {

	var testData = testHarnessFn(assert,'S1C1',{success: false, data: 'S1C1'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'S1C1>>reject0(\"S1C1\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0','error0'),
						  generateResponseFn(lo,'reject0'))
					.catch(generateResponseFn(lo,'catch1'));
						  
});


/**  Successful Ajax Response, the (SUCCESS) handler works properly*/
test('validate basic promises S1NC1', function(assert) {

	var testData = testHarnessFn(assert,'S1NC1',{success: true, data: 'S1NC1'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'S1NC1>>success0(\"S1NC1\")');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0'))
					.catch(generateResponseFn(lo,'catch1'));
						  
});

/** Finally works (success, no error on handling) */
test('validate basic promises finally S1F2', function(assert) {

	var testData = testHarnessFn(assert,'S1F2',{success: true, data: 'S1F2'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'S1F2>>success0(\"S1F2\")>finally1(undefined)');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0'))
					.finally(generateResponseFn(lo,'finally1'));
						  
});


/** Finally works (failure case, no error on handling) */
test('validate basic promises finally R1TF2', function(assert) {

	var testData = testHarnessFn(assert,'R1TF2',{success: false, data: 'R1TF2'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'R1TF2>>reject0(\"R1TF2\")>finally1(undefined)');
	});

	var lo = testData.logObject;

	testData.promise.then(generateResponseFn(lo,'success0'),
						  generateResponseFn(lo,'reject0'))
					.finally(generateResponseFn(lo,'finally1'));
						  
});

// ==============================================
// DEFAULT ERROR HANDLING SPECIFIC TEST-CASES
// ==============================================


/**  Successful Ajax Response, the (SUCCESS) handler throws an error, the DEFAULT error handler picks up 
	because the user defined no CATCH handler themselves.... */
test('validate ERROR HANDLING promise w Default Catch EHDC1', function(assert) {

	if (!USE_ERROR_HANDLING_PROMISE) {
		assert.expect(0);
		return;
	}

	var testData = testHarnessFn(assert,'EHDC1',{success: true, data: 'EHDC1'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'EHDC1>>success0(\"EHDC1\")>DefaultCatchEHDC1(\"SH_errorEHDC1\")');
	});

	var lo = testData.logObject;

	testData.promise.setDefaultCatch(generateResponseFn(lo,'DefaultCatchEHDC1'));	
	testData.promise.then(generateResponseFn(lo,'success0','SH_errorEHDC1'));		  
});

/**  Successful Ajax Response, the (SUCCESS) handler throws an error, the DEFAULT error handler picks up 
	because the user defined no CATCH handler themselves.... */
test('validate ERROR HANDLING promise w Default Catch EHDC2', function(assert) {

	if (!USE_ERROR_HANDLING_PROMISE) {
		assert.expect(0);
		return;
	}

	var testData = testHarnessFn(assert,'EHDC2',{success: true, data: 'EHDC2'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'EHDC2>>success0(\"EHDC2\")>success1(\"EHDC2\")>success2(\"EHDC2\")>HANDLED-ERROR(\"errorSH_2\")>success3(\"EHDC2-error-handled\")>success4(\"EHDC2-error-handled\")');
	});

	var lo = testData.logObject;

	testData.promise.setDefaultCatch(generateResponseFn(lo,'HANDLED-ERROR',null,'EHDC2-error-handled'));	
	testData.promise.then(generateResponseFn(lo,'success0'))  // Success0(EHDC2)
		.then(generateResponseFn(lo,'success1'))			  // + Success1(EHCD2)
		.then(generateResponseFn(lo,'success2','errorSH_2'))  // + Success2(EHDC2) + HANDLED-ERROR(errorSH_2)
		.then(generateResponseFn(lo,'success3'))			 //  + Success3(EHDC2-error-handled)
		.then(generateResponseFn(lo,'success4'));			 //  + Success4(EHDC2-error-handled)


});



/**  COMPLEX CHAINING  */
test('validate basic promise w similar test case to EHDC3', function(assert) {

	var testData = testHarnessFn(assert,'TC3',{success: true, data: 'TC3'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'TC3>>success0(\"TC3\")>success1(\"TC3\")>error_handle2(\"errorSH_1\")>success3(\"direct-handled-error\")>catch_handler3(\"errorSH_3\")>success4(\"catch-handled-error\")>terminal(\"terminal-catch-should-catch-me\")');
	});

	var lo = testData.logObject;
	
	testData.promise.then(generateResponseFn(lo,'success0'))  
		.then(generateResponseFn(lo,'success1','errorSH_1'))  
		.then(generateResponseFn(lo,'success2'), 
			  generateResponseFn(lo,'error_handle2',null,'direct-handled-error'))		
		.then(generateResponseFn(lo,'success3','errorSH_3'))
		.catch(generateResponseFn(lo,'catch_handler3',null,'catch-handled-error'))			
		.then(generateResponseFn(lo,'success4','terminal-catch-should-catch-me'))
		.catch(generateResponseFn(lo,'terminal'));


});

/**  Successful Ajax Response, the (SUCCESS) handler throws an error, the DEFAULT error handler picks up 
	because the user defined no CATCH handler themselves.... */
test('validate ERROR HANDLING promise w Default Catch EHDC3', function(assert) {

	if (!USE_ERROR_HANDLING_PROMISE) {
		assert.expect(0);
		return;
	}

	var testData = testHarnessFn(assert,'EHDC3',{success: true, data: 'EHDC3'},function(data) {
		//EXPECT all the calls to do this...
		assert.strictEqual(data,'EHDC3>>success0(\"EHDC3\")>success1(\"EHDC3\")>error_handle2(\"errorSH_1\")>success3(\"direct-handled-error\")>catch_handler3(\"errorSH_3\")>success4(\"catch-handled-error\")>DEFAULT-HANDLED-ERROR(\"final-error\")');
	});

	var lo = testData.logObject;

	testData.promise.setDefaultCatch(generateResponseFn(lo,'DEFAULT-HANDLED-ERROR',null,'EHDC3-error-handled'));	
	testData.promise.then(generateResponseFn(lo,'success0'))  // Success0(EHDC2)
		.then(generateResponseFn(lo,'success1','errorSH_1'))			  // + Success1(EHCD2)
		.then(generateResponseFn(lo,'success2'), 
			  generateResponseFn(lo,'error_handle2',null,'direct-handled-error'))		
		.then(generateResponseFn(lo,'success3','errorSH_3'))
		.catch(generateResponseFn(lo,'catch_handler3',null,'catch-handled-error'))			
		.then(generateResponseFn(lo,'success4','final-error'));			

});

