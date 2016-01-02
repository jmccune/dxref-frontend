import Ember from 'ember';
import { module, test } from 'qunit';
import { ErrorHandlingPromise } from 'dxref/core/error-handling-promise';

module('Unit | Core | ErrorHandlingPromise');

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

	// if (true) {
	// 	return promise;
	// }

	var ePromise = new ErrorHandlingPromise(promise);
	return ePromise;
};

var generateResponseFn=function(logObject,tagForFnCalled,throwMessage) {
	return function(x) {	
		logObject.logCalls+='>'+tagForFnCalled+'('+JSON.stringify(x)+')';
		if (throwMessage) {
			throw throwMessage;
		}
		return x;
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
