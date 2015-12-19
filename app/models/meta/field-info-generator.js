import { Constants } from 'dxref/dxref-config';


/**
Field Info --
	Each field may have meta-data about it that includes (potentially) the following:
	//The first 2 fields are REQUIRED.   

	name:  <string>    
	type:      ['STRING','DATETIME.*','NUMBER.*', 'SET','ARRAY',<!EXTENDABLE TO NEW VALUES!>, etc],
	required:  true | false | <string = $functionName of the acceptance condition>
	editable:  true | false | <string = $functionName of the acceptance condition>
	displayable: true | false | <string = $functionName of the acceptance condition>
	label:  <string> | <$functionName of generator>  //the label to associate with the field (if not the name itself)

		--------------------------
	format = <*>
		  .options  = <Set of choices>  // these choices may be given to the user.  <TBD>  
		  								//example-- what date format(s) to use.  		 
	    -------------------------
		  min:  <low value>
		  max:  <high value>
		  choices: <Set of choices:Map or Array>  //Used as recommended choices.
		  choices.closed:  true | false | ...     //whether or not the value given must be one of the choices.
		  acceptanceFn: <string = functionName of acceptance condition>
	value.acceptanceFn.context: <*>  //data/argument passed to acceptanceFn with the field and value.		 
		 .ETC
		-------------------------

*/


function FieldInfoGenerator() {
	this.fieldInfoArray=null;
}

FieldInfoGenerator.prototype.startDefinition=function() {
	this.fieldInfoArray=[];	
	return this;
};

FieldInfoGenerator.prototype.addField=function(name,type,required,editable,displayable,fmtInfo) {
	if (!this.fieldInfoArray) {
		throw "Has not started definition!";
	}

	if (!name) {
		throw "Name is required!";
	}

	if (!type) {
		throw "Type is required!";
	}

	if (required!==Constants.REQUIRED && required!==Constants.OPTIONAL) {
		required=Constants.OPTIONAL;
	}

	if (editable!==Constants.EDITABLE && editable!==Constants.UNEDITABLE) {
		editable=Constants.EDITABLE;
	}
	if (displayable!==true && displayable!==false) {
		displayable=true;
	}

	var newFieldInfo = {
		'name':name,
		'type':type,
		'required':required,
		'editable':editable,
		'displayable': displayable,
		'fmtInfo' :fmtInfo
	};

	this.fieldInfoArray.push(newFieldInfo);

	return this;
};

FieldInfoGenerator.prototype.setRestrictedValues=function(values) {
	var lastInfo = this.fieldInfoArray[this.fieldInfoArray.length-1];
	if (!lastInfo) {
		throw "FieldInfoGenerator >> no field info to set restricted values on!";
	}	
	lastInfo.restrictedValues = values;	
	return this;
};


FieldInfoGenerator.prototype.done=function() {
	var result = this.fieldInfoArray;
	this.fieldInfoArray=null;	
	return result;
};

var theFieldInfoGenerator = new FieldInfoGenerator();
export default theFieldInfoGenerator;