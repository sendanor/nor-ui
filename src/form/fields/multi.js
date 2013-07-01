/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements multi value field as a select input element.
    * @memberof form.fields
	* @namespace multi
    */
	var exports = {
		'create': function(key, value, meta) {
			var type = meta.getType(key);
			var div = $('<div class="field multi" />');
			var label = $('<label/>').text(meta.t(key));
			var select = $('<select/>').attr('selected', value).attr('name', key);
			$(select).append( $('<option/>').attr('value', '').text('Valitse') );
			$.each(type.options, function(k, v) {
				var option = $('<option/>').attr('value', k).text(v);
				if(k === value) {
					option.attr('selected', 'selected');
				}
				$(select).append( option );
			});
			div.append(label);
			div.append(select);
			return div;
		} // create
	}; // exports

	// End of library code
	return exports;
});
/* EOF */
