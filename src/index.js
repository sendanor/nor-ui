/* Index module */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["./form", "./client", "./meta", "./modal"], function(form, client, meta, modal) {
	var index = {
		'form':   form,
		'client': client,
		'meta':   meta,
		'modal':  modal
	};
	return index;
});
