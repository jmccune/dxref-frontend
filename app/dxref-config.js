
/** 
	See Overall Config at the bottom of the file.
*/


/** ============= THE OVERALL CONFIG OBJECT ======================*/
var dxrefConfig= {
	pollingDelayMs: 1000,   
	serverMap: {
		'dxref-service': 'http://localhost:8080',
		'auth-service':  'http://localhost:8080',
	}	
};


/** ============= APPLICATION CONSTANTS    ======================*/
export var Constants = {
	DXREF_SERVICE : 'dxref-service',
	AUTH_SERVICE  : 'auth-service',

	REQUIRED: ValidatorJs.REQUIRED,  //TRUE
	OPTIONAL: ValidatorJs.OPTIONAL,  //FALSE

	EDITABLE: 'editable',
	UNEDITABLE: 'uneditable',

	//TYPES
	ID:         'Identifier',
	STRING:     'String',
	DATETIME:   'DateTime',
	LIST:       'List',
	SET:        'Set',  // a list/array (behaves like a set)
	NUMBER:     'Number'

};

export var dxrefValidator = new ValidatorJs();

/** ============= LOGGING CONFIGURATION    ======================*/
var ROOT_LEVEL = log4javascript.Level.INFO;
var logConfigMap = {
	'dxref':'INFO',
	'dxref.services.data-service': 'INFO'     //DEBUG will show the exact responses...
};

var loggerLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p %c - %m%n");

// -- Standard sort of setup/configuration --- 

var rootLogger = log4javascript.getRootLogger();
var consoleAppender = new log4javascript.BrowserConsoleAppender();
consoleAppender.setLayout(loggerLayout);
rootLogger.addAppender(consoleAppender);
rootLogger.setLevel(ROOT_LEVEL);

_.forEach(logConfigMap, function(levelSpec,logspec) {
	var level = log4javascript.Level[levelSpec];
	log4javascript.getLogger(logspec).setLevel(level);
});


export default dxrefConfig;