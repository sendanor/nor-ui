/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

	/** 
	 * Implements hidden field.
	 * @memberof module:nor-ui.form.fields
	 * @namespace hidden
	 * @todo Maybe jquery could be avoided by using something more portable
	 */
	var exports = {
		/** Create element
		 * @memberof module:nor-ui.form.fields.hidden
		 */
		'create': function(key, value, meta) {
			var div = $('<div class="field hide" />');
			var input = $('<input type="hidden"/>').attr('value', value).attr('name', key);
			div.append(input);
			return div;
		}
	};

	// End of library code
	return exports;
});
/* EOF */
