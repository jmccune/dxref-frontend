ember new less-app

ember install ember-cli-less

bower install --S bootstrap

	bower bootstrap#*               cached git://github.com/twbs/bootstrap.git#3.3.4
	bower bootstrap#*             validate 3.3.4 against git://github.com/twbs/bootstrap.git#*
	bower bootstrap#*                  new version for git://github.com/twbs/bootstrap.git#*
	bower bootstrap#*              resolve git://github.com/twbs/bootstrap.git#*
	bower bootstrap#*             download https://github.com/twbs/bootstrap/archive/v3.3.5.tar.gz
	bower bootstrap#*              extract archive.tar.gz
	bower bootstrap#*             resolved git://github.com/twbs/bootstrap.git#3.3.5
	bower bootstrap#~3.3.5         install bootstrap#3.3.5

	bootstrap#3.3.5 bower_components/bootstrap
	└── jquery#1.11.3

###Followed the instructions here: https://github.com/gdub22/ember-cli-less


	Install Bootstrap source:

	bower install --S bootstrap
	Specify the include paths in Brocfile.js:

	var app = new EmberApp({
	  lessOptions: {
	    paths: [
	      'bower_components/bootstrap/less'
	    ]
	  }
	});
	Import into app.less:

	@import 'bootstrap';


###Changed Ember Data to x.19 in package.json & bower.json
bower install  
npm install  



###Adding components
ember generate component app-header
ember generate component nav-bar

