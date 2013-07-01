/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements submit button
    * @memberof module:nor-ui.form.fields
	* @namespace submit
    */
	var exports = {
		'create': function(key, value, meta) {
			return $('<div class="field buttons" />').append( $('<input class="btn" type="submit">').attr('value', meta.t('submit')) );	
		}
	};

	// End of library code
	return exports;
});
/* EOF */
