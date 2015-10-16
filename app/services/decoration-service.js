
var decorationEngine = new DecorationEngine();



// MAP FACTORY
function DxrefDecoratorFactory() {
	SimpleHtmlDecoratorFactory.call(this);  // Call super constructor

	var originalHtmlTags = ["h1", "h2", "h3", "h4", "h5", "h6",
                "li", "ul", "ol",
                "p", "br", "pre",
                "table", "tr", "td",
                "a"];
	var _this = this;
	_.forEach(originalHtmlTags,function(tag){
		_this.addDecoratorPrototype(tag, new HtmlDecorator(tag));
	});  
}
DxrefDecoratorFactory.prototype = Object.create(SimpleHtmlDecoratorFactory.prototype);
DxrefDecoratorFactory.prototype.constructor = DxrefDecoratorFactory;



var mapFactory = new DxrefDecoratorFactory();
// console.log("CREATED MAP FACTORY");
// console.dir(mapFactory);

mapFactory.addDecoratorPrototype("phone",new  HtmlDecorator("phone"));




decorationEngine.setDecoratorFactory(mapFactory);


var DecorationService = {

	getDecorationEngine: function() {
		return decorationEngine;
	},
	getDecoratedText: function(decSpec) {
		return decorationEngine.getDecoratedText(decSpec);
	}
};

export default DecorationService;
