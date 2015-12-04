import { Constants } from 'dxref/dxref-config';

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

	this.fieldInfoArray.push({
		'name':name,
		'type':type,
		'required':required,
		'editable':editable,
		'displayable': displayable,
		'fmtInfo' :fmtInfo
	});

	return this;
};

FieldInfoGenerator.prototype.done=function() {
	var result = this.fieldInfoArray;
	this.fieldInfoArray=null;
	return result;
};

var theFieldInfoGenerator = new FieldInfoGenerator();
export default theFieldInfoGenerator;