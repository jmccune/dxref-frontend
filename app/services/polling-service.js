import dxrefConfig from 'dxref/dxrefconfig';

var data= {
	list: [],
	map: {},	
	pollTimeoutId: null,
	pollCount: 0
}
/** THE POLLING FUNCTION */
function pollingFunction() {
	data.pollTimeoutId = setTimeout(function() { pollingFunction(); }, 
		dxrefConfig.pollingDelayMs);

	//For each polling callback, invoke it...
	_.forEach(data.list,function(name) {
		data.map[name](data.pollCount);
	});

	data.pollCount++;
}

/** Helper function -- logs the count to remind us that its going on during development*/
function logPollCount(pollCount) {
	if (pollCount===0) {
		console.log("STARTING POLLING!");
	}
	else if (pollCount%5===0) {
		console.log("Polled: "+pollCount+" times");
	}
}


var PollingService = {

	addPollable: function(name, cbFunc) {
		if (typeof name !== 'string') {
			throw "first argument to add pollable must be the name/key!";
		}

		if (data.map[name]) {
			this.removePollable(name);
		} 

		data.list.push(name);
		data.map[name] = cbFunc;

		console.log("DATA>>");
		console.dir(data);
	},

	removePollable: function(name) {
		var indexPos = data.list.indexOf(name);
		if (indexPos === -1) {
			return false;
		}

		data.list.splice(indexPos,1);
		delete data.map[name];
		return true;		
	},
	isPolling: function() {
		return data.pollTimeoutId!=null;
	},
	poll: function() {
		if (data.pollTimeoutId) {
			return;
		}
		//Otherwise we need to start...
		pollingFunction();
	}
};

PollingService.addPollable('logPolling',logPollCount);

export default PollingService;