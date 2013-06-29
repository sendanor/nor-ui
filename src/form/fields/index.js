/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements different field types
    * @module nor-ui/form/fields
	* @todo Fix '_form_meta' is not defined.
    */
	var exports = {
		'hidden'   : require('./hidden.js'),
		'location' : require('./location.js'),
		'file'     : require('./file.js'),
		'multi'    : require('./multi.js'),
		'year'     : require('./year.js'),
		'text'     : require('./text.js'),
		'textarea' : require('./textarea.js'),
		'submit'   : require('./submit.js')
	};

	// End of library code
	return exports;
});
/* EOF */
