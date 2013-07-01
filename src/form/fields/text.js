/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements text field
    * @memberof form.fields
	* @namespace text
    */
	var exports = {
		'create': function(key, value, meta) {
			var div = $('<div class="field text" />');
			var label = $('<label/>').text(meta.t(key));
			var input = $('<input type="text"/>').attr('value', value).attr('name', key);
			div.append(label);
			div.append(input);
			return div;
		}
	};

	// End of library code
	return exports;
});
/* EOF */
