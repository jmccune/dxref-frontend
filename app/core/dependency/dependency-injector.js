import { dxrefValidator } from 'dxref/dxref-config';
var logger = log4javascript.getLogger('dxref/core/dependency/dependency-injector');

export function DependencyInjector() {

	this.diMap = {};
	this._reset();

}

DependencyInjector.prototype._reset=function() {
	this.creationStack=[];
};

DependencyInjector.prototype._error=function(msg) {
	logger.error(msg);
	throw msg;
};

DependencyInjector.prototype.provide=function(name,context) {

	//Guard against bad input...
	dxrefValidator
		.throwIfNotString('name',name,true)
		.throwIfNotObjectMap('context',context);

	var provisioningInfo = this.diMap[name];
	if (!provisioningInfo) {
		this._error('DependencyInjector#provide>> There is no provider for: '+name);
	}

	// If the item has already been provisioned, return it...
	if (provisioningInfo.state==='P') {
		return provisioningInfo.provisionedItem;
	}

	// Otherwise we will attempt to provision the item and all its depedencies...
	
	//First note what we are currently trying to provision (which may lead to other 
	//provisionings...
	this.creationStack.push(name);
	var createdDependency = null;
	try {
		

		if (provisioningInfo.state==='C') {
			var oldStack = this.creationStack;
			this._reset();
			this._error("Circular depenendency detected >> "+JSON.stringify(oldStack));
		}

		provisioningInfo.state='C'; // [C]reating...

		var _this =this;
		var satisfiedDependenciesArray = [];
		provisioningInfo.dependencies.forEach(function(depedencyName) {
			satisfiedDependenciesArray.push(_this.provide(depedencyName,context));
		});

		satisfiedDependenciesArray.push(context);
		var tempThisContext = {};
		createdDependency = provisioningInfo.creationFn.apply(tempThisContext,satisfiedDependenciesArray);

		provisioningInfo.provisionedItem = createdDependency;
		provisioningInfo.state='P';  // PROVISIONED

	}
	catch (e) {				
		var name=this.creationStack[this.creationStack.length-1];
		logger.warn("Failed to create: "+name);
		this._error(e);		
	}
	finally {
		this.creationStack.pop();
	}

	return createdDependency;
};

DependencyInjector.prototype.addProvider=function(name,oneTimeCreationFn,dependencies) {

	dxrefValidator
		.throwIfNotString('name',name,true)
		.throwIfNotFunction('oneTimeCreationFn',oneTimeCreationFn,true)
		.throwIfNotArray('dependencies',dependencies);

	if (this.diMap[name]) {
		this._error('DependencyInjector#addProvider>> There already exists a provider for: '+name);		
	}

	if (!dependencies) {
		dependencies = [];
	}

	//Implementation...
	this.diMap[name]={
		creationFn: oneTimeCreationFn,
		dependencies: dependencies,
		state: 'U',   // U means UNPROVISIONED
		provisionedItem: null
	};

	return this;
};


export var theDI = new DependencyInjector();