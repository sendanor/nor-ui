/* Index module */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["./form", "./client", "./meta", "./modal"], function(form, client, meta, modal) {
	/** 
	 * The main include path for our public API
	 * @module nor-ui
	 */
	var exports = {
		'form':   form,
		'client': client,
		'meta':   meta,
		'modal':  modal
	};
	return exports;
});
