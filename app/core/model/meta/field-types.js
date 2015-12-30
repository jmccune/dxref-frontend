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
		//DATETIME:   '_f_DateTime',  		
		//DATE:       '_f_DateTime.Date',
		//TIME: 		'_f_DateTime.Time',
		LIST:       '_f_List',     // a list/array 
		SET:        '_f_List.Set', // a list/array where values do not (cannot) repeat.
		NUMBER:     '_f_Number',
		BOOLEAN:    '_f_Boolean',
		OBJECT:     '_f_Object', // An Object/Map
		ANY:        '_f_Any',    // Represents that the field is expected to hold anything.
		MAP_OR_LIST:'_f_Map_Or_List',
		FUNCTION:   '_f_Function',
		NAMED_FUNCTION: '_f_Named_Function' // A string that must exist in the application function registry.
	},
	SetAttributes: {		   //Can other (arbitrary) fields be added?
		OPEN: 	     'open',	   // Yes
		CLOSED:      'closed',     // No
		CONSTRAINED: 'constrained' //FUTURE... TBD. 
	},
	Value: {
		REQUIRED: true,
		OPTIONAL: false,
	}
};