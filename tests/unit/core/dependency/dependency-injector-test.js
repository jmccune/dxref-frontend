
import { theDI, DependencyInjector } from 'dxref/core/dependency/dependency-injector';
import { module, test } from 'qunit';

module('Unit | Core | Dependency | DependencyInjector');

var testContext ={};
var setTestContext=function(testDI,assert) {
	testContext.testDI = testDI;
	testContext.assert = assert;
};

var addProviderTest=function(name, dependencies) {
	var assert = testContext.assert;
	var testDI = testContext.testDI;

	if (!dependencies) {
		dependencies=[]; 
	}

	var provisioningFunction=function() {
		assert.equal(arguments.length,dependencies.length+1);
		var args = Array.prototype.slice.call(arguments);
		args = args.slice(0,args.length-1);
		return name+'('+args.join()+')';
	};

	testDI.addProvider(name,provisioningFunction,dependencies);
};


test('it provisions simply as expected ', function(assert) {

	var provisionResult = 'exactlyAsExpected';
	var testDI = new DependencyInjector();

	testDI.addProvider('b:a',function() {
		return provisionResult;
	});

	var testResult = testDI.provide('b:a');	
	assert.equal(testResult,provisionResult);

});

test('theDI also provisions correctly', function(assert) {
	var provisionResult = 'exactlyAsExpected';
	theDI.addProvider('b:a',function() {
		return provisionResult;
	});

	var testResult = theDI.provide('b:a');	
	assert.equal(testResult,provisionResult);
});

test('it provides all required dependencies correctly', function(assert) {
	
	var testDI = new DependencyInjector();

	var addProviderTest=function(name, dependencies) {
		if (!dependencies) {
			dependencies=[];
		}

		var provisioningFunction=function() {
			assert.equal(arguments.length,dependencies.length+1);
			var args = Array.prototype.slice.call(arguments);
			args = args.slice(0,args.length-1);
			return name+'('+args.join()+')';
		};

		testDI.addProvider(name,provisioningFunction,dependencies);
	};

	//LEAF NODES
	setTestContext(testDI,assert);
	addProviderTest('L2');
	addProviderTest('M3');
	addProviderTest('N3');
	addProviderTest('O1');
	addProviderTest('P2');

	// Other nodes...
	addProviderTest('J2',['M3','N3']);
	addProviderTest('K1',['N3']);
	
	addProviderTest('E1',['L2','J2']);
	addProviderTest('F1',['P2']);
	addProviderTest('G1',[]);
	addProviderTest('H1',[]);
	addProviderTest('I1');

	addProviderTest('A0',['E1']);
	addProviderTest('B0',['K1','O1','P2']);
	addProviderTest('C0',['N3']);
	addProviderTest('D0',['F1','G1','H1','I1']);

	addProviderTest('test',['A0','B0','C0','D0']);
		
	var testResult = testDI.provide('test');
	var expectedResult= 'test(A0(E1(L2(),J2(M3(),N3()))),B0(K1(N3()),O1(),P2()),C0(N3()),D0(F1(P2()),G1(),H1(),I1()))';	
	assert.equal(testResult,expectedResult);

});

test('it detects cycles correctly', function(assert) {
	
	var testDI = new DependencyInjector();


	setTestContext(testDI,assert);
	addProviderTest('A',['B']);
	addProviderTest('B',['C']);
	addProviderTest('C',['A']);
			
	assert.throws(function(){
		testDI.provide('A');
	},' Circular depenendency detected >> ["A","B","C","A"]');
	
	
});