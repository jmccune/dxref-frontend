var TypeAdapter = function() {

};

TypeAdapter.prototype.formatTimeFromIso8601=function(serverTime) {
	//"2015-12-03T23:00:02.452-05:00[America/New_York]"
	return serverTime.substring(10,18);
};

TypeAdapter.prototype.formatDateFromIso8601=function(serverTime) {
	//"2015-12-03T23:00:02.452-05:00[America/New_York]"
	return serverTime.substring(0,10);
};

TypeAdapter.prototype.formatDateTimeFromIso8601=function(serverTime) {
	//"2015-12-03T23:00:02.452-05:00[America/New_York]"
	return serverTime.substring(0,18).replace("T"," ");
};


var theTypeAdapter = new TypeAdapter();

export default theTypeAdapter;