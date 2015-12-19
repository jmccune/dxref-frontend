
/** 
FieldType Rules:
	must begin with '_f_'
	anything before the first period (and after the _f_ prefix) must 
		match exactly ONE typename.
			(e.g. "_f_This_Must_Exist.who_cares_about_this.and_this_can_not_exist_too"  would
			mean that there must be a Type named "THIS_MUST_EXIST" in the type map.
*/
export const FieldConstants= {	
	Type: { 
		ID:         '_f_Id',
		STRING:     '_f_String',
		DATETIME:   '_f_DateTime',  		
		DATE:       '_f_DateTime.Date',
		TIME: 		'_f_DateTime.Time',
		LIST:       '_f_List',    // a list/array 
		SET:        '_f_Set',     // a list/array where values do not (cannot) repeat.
		NUMBER:     '_f_Number',
		BOOLEAN:    '_f_Boolean'
	},
	SetAttributes: {		   //Can other (arbitrary) fields be added?
		OPEN: 	     'open',	   // Yes
		CLOSED:      'closed',     // No
		CONSTRAINED: 'constrained' //FUTURE... TBD. 
	}
};


function FieldUtils() {}

FieldUtils.prototype.isValidFieldType=function(typeName) {
	if (typeName.indexOf('_f_')!==0) {
		return false;
	}
	var typeKey = typeName.substring(3);
	var typeKeyEnd = typeKey.indexOf('.');
	if (typeKeyEnd!==-1) {
		typeKey = typeKey.substring(0,typeKeyEnd);
	}
	typeKey = typeKey.toUpperCase();

	var exists = FieldConstants.Type[typeKey];

	return exists!==undefined;
};


export var theFieldUtils = new FieldUtils();
