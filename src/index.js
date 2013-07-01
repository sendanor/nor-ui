/* Index module */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["./form", "./client", "./meta", "./modal"], function(form, client, meta, modal) {
	/** 
	 * The main include path for our public API
	 * @exports nor-ui
	 * @version 0.1.0
	 * @namespace
	 * @borrows form as module:nor-ui/form
	 * @borrows client as module:nor-ui/client
	 * @borrows meta as module:nor-ui/meta
	 * @borrows modal as module:nor-ui/modal
	 */
	var index = {
		'form':   form,
		'client': client,
		'meta':   meta,
		'modal':  modal
	};
	return index;
});
