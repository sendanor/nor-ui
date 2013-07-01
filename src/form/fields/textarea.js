/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements textarea field
    * @memberof module:nor-ui.form.fields
	* @namespace textarea
    */
	var exports = {
		'create': function(key, value, meta) {
			var div = $('<div class="field textarea" />');
			var label = $('<label/>').text(meta.t(key));
			var input = $('<textarea>').attr('name', key).text(value);
			div.append(label);
			div.append(input);
			return div;
		}
	};

	// End of library code
	return exports;
});
/* EOF */
