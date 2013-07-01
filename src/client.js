/* Backend Client Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function ($) {
	"use strict";

   /** 
    * A module implementing AJAX library for our smart REST backend
    * @exports nor-ui/client
    * @version 0.1.0
    */
	var $client = {};

	/** Populate default values from ._meta.defaults if it exists 
	*@memberof nor-ui/client 
	*@inner
	*@method populate_defaults sets default values if they do not exist
	*@param defs default meta object
	*@TODO Unnecessary jquery dependency -- foreach could be implemented depency-free
	*/
	function populate_defaults(obj) {
		if(!(obj && obj._meta && obj._meta.defaults)) {
			return;
		}
		var defs = obj._meta.defaults;
		// FIXME: Unnecessary jquery dependency -- foreach could be implemented depency-free
		$.each(defs, function(key, value) {
			if(!obj[key]) {
				obj[key] = value;
			}
		});
	}

	/** Fetch resource 
	*@param url
	*@param fn function callback
	*@TODO $.getJSON could be implemented using common API which supports multiple implementations for HTTP requests, so that jquery would not be a dependency.
	*@TODO Implement cache with some kind of version control
	*@TODO Unnecessary jquery dependency -- foreach could be implemented depency-free
	*@TODO Implement better error control
	*/
	$client.get = function(url, fn) {
		// FIXME: $.getJSON could be implemented using common API which supports multiple implementations for HTTP requests, so that jquery would not be a dependency.
		$.getJSON(url, function(data) {
			
			// Fetch prototype if it exists
			if(data && data._links && data._links.proto && data._links.proto.href) {

				// FIXME: Implement cache with some kind of version control

				// FIXME: Unnecessary jquery dependency -- foreach could be implemented depency-free
				$.getJSON(data._links.proto.href, function(proto) {

					// FIXME: Unnecessary jquery dependency -- foreach could be implemented depency-free
					$.each(proto, function(key, value) {
						if(data[key] === undefined) {
							data[key] = value;
						}
					});
					
					// Pass it on
					populate_defaults(data);
					fn(data);
				}).fail(function(err) {
					// FIXME: Implement better error control
					alert('Error (GET ' + data._links.proto.href +'): ' + err);
				});

			} else {

				// Pass it on
				populate_defaults(data);
				fn(data);
			}

		}).fail(function(err) {
			// FIXME: Implement better error control
			alert('Error (GET '+url+'): ' + err);
		});
	};

// End of library code
return $client;
});
/* EOF */
