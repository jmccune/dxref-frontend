/** OrderArgumentInterpreter -- does the actual conversion from an arugment list to
	the arguments.  Validating (as designated by the build specification.)
	*/
export function OrderedArgumentInterpreter(specification) {
	this.specification = specification;
}

OrderedArgumentInterpreter.prototype.convertToMap=function(givenArguments) {

	_.forEach(givenArguments,function(value,index) {
		console.log("INDEX: "+index);
		console.dir(value);
	});


	return {};
};