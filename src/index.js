/* Index module */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["./form", "./client", "./meta", "./modal"], function(form, client, meta, modal) {
   /** 
    * The main include path for our public API
    * @exports nor-ui
    * @version 0.1.0
    */
	var index = {
		'form':   form,
		'client': client,
		'meta':   meta,
		'modal':  modal
	};
	return index;
});
