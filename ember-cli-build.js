/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
	var app = new EmberApp({
			lessOptions: {
				paths: [
				  'bower_components/bootstrap/less',
				  'bower_components/components-font-awesome/less/'
				]
			}
		});


	// Use `app.import` to add additional libraries to the generated
	// output files.
	//
	// If you need to use different assets in different
	// environments, specify an object as the first parameter. That
	// object's keys should be the environment name and the values
	// should be the asset to use in that environment.
	//
	// If the library that you are including contains AMD or ES6
	// modules that you would like to import into your application
	// please specify an object with the list of modules as keys
	// along with the exports of each module as its value.
	app.import('bower_components/lodash/lodash.js',{ 'lodash': ['default'] });
	app.import('bower_components/validator-js/release/validator.js');
	app.import('bower_components/decoration-engine-js/release/decoration-engine.js');
	app.import('bower_components/log4javascript/log4javascript.js');
	app.import('bower_components/wysihtml/dist/wysihtml-toolbar.min.js');
	app.import('bower_components/wysihtml/parser_rules/advanced_and_extended.js');

	app.import('bower_components/components-font-awesome/fonts/fontawesome-webfont.ttf',{
		destDir: "fonts"
	});
	app.import('bower_components/components-font-awesome/fonts/fontawesome-webfont.woff2',{
		destDir: "fonts"
	});
	app.import('bower_components/components-font-awesome/fonts/fontawesome-webfont.woff',{
		destDir: "fonts"
	});
	return app.toTree();
};

