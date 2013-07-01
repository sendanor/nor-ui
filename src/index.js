/* Index module */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["./form", "./client", "./meta", "./modal"], function(form, client, meta, modal) {
	/** 
	 * The main include path for our public API
	 * @module nor-ui
	 * @borrows nor-ui.form as form
	 * @borrows nor-ui.client as client
	 * @borrows nr-ui.meta as meta
	 * @borrows nor-ui.modal as modal
	 */
	var exports = {
		'form':   form,
		'client': client,
		'meta':   meta,
		'modal':  modal
	};
	return exports;
});
