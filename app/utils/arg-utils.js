
import { OrderedArgumentBuilder } from 'dxref/utils/support/ordered-argument-builder';
/*

	When building up an argument list, you may have a default argument ordering.
	a,b,c,d,e...  where the last of the arguments is a MAP which defines the
	rest of the options that the map can use. 



*/














let argUtils = {
	createOrderedArgumentBuilder: function() { return new OrderedArgumentBuilder(); }
};


export default argUtils;