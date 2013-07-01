/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery", "../../meta"], function($, $meta) {
	"use strict";

   /** 
    * Implements year value field
    * @module nor-ui/form/fields/year
	* @namespace nor-ui.form.fields.year
	* @todo Fix '_form_meta' is not defined.
    */
	var exports = {
		'create': function(key, value, meta) {
			return exports.fields.multi.create(key, value, $meta.parse(_form_meta) );
		}
	};

	// End of library code
	return exports;
});
/* EOF */
