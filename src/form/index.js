/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery", "./client", "./meta"], function($, $client, $meta) {
	"use strict";

	/**
	 * A module implementing forms.
	 * @module nor-ui/form
	 * @namespace nor-ui.form
	 */
	var exports = {
		'fields': {}
	};

	/** Default metadata for forms
	 * @inner
	 * @memberof module:nor-ui/form
	 */
	var _form_meta = {
		'_meta': {
			'types': {
				'year': {
					'type': 'multi',
					'options': {}
				}
			},
			'translations': {
				'fi': {
					'year': 'Vuosi',
					'submit': 'Lähetä'
				},
				'en': {
					'year': 'Year',
					'submit': 'Send'
				}
			}
		}
	};
	
	// Populate default year values
	var current_year = new Date().getFullYear();
	var i;
	for(i = current_year-20; i<=current_year; i+=1) {
		_form_meta._meta.types.year.options[i] = i;
	}
	
	/**
	 * @callback fieldCreateCallback
	 * @memberof module:nor-ui/form
	 * @inner
	 * @param {string} key - Field keyword
	 * @param {string} value - Field value
	 * @param {object} meta - Meta object
	 */

	/**
	 * @typedef fieldsObject
	 * @memberof module:nor-ui/form
	 * @inner
	 * @type {object}
	 * @property {fieldCreateCallback} create - Function which builds the element
	 */

	/** Implementations of field types
	 * @enum {fieldsObject}
	 * @memberof module:nor-ui/form
	 */
	exports.fields = require('fields/index.js');

	/**
	 * @callback form~successCallback
	 * @memberof module:nor-ui/form
	 * @inner
	 * @param {object} form - HTML element
	 */
	
	/**
	 * @typedef form~options
	 * @memberof module:nor-ui/form
	 * @inner
	 * @type {object}
	 * @property {form~successCallback} success - Callback which will be called after the form has been built.
	 */

	/** Initialize forms 
	 * @memberof module:nor-ui/form
	 * @param {object|string} obj - Element where the form will be created. It can also be JQuery selector string.
	 * @param {form~options} opts - Options for initialization
	 */
	exports.initForm = function(obj, opts) {

			opts = opts || {};
			var form_div = $(obj);
			var action = $(form_div).attr('data-action');
			var method = (''+($(form_div).attr('data-method') || 'post')).toLowerCase();
			var fields_from = $(form_div).attr('data-fields-from') || action;

			var data_fields_ignore = $(form_div).attr('data-fields-ignore');
			var fields_ignore = [];
			if(data_fields_ignore) {
				fields_ignore = (''+data_fields_ignore).split(/ +/);
			}

			var form = $('<form/>');

			if(method !== "post") {
				form.append( $('<input type="hidden" name="_action"/>').attr('value', method) );
			}
			
			$(form).submit(function() {
				if( (method === "post") || (method === "delete") ) {
					//alert("Posting to " + action + "...");
					$.post(action, $(form).serialize(), function() {
						$(form).trigger('reset');
						if(opts.success) {
							opts.success(form_div);
						} else {
							// FIXME: There should be better way than alert()!
							alert("OK");
						}
					}).fail(function() {
						alert("Operation failed!");
					});
				} else {
					// FIXME: Add an error message -- unknown method!
					alert("Unknown form method");
				}
				return false;
			});
		
			if(fields_from) {
				$client.get(fields_from, function(data) {
					var meta = $meta.parse(data);
					$.each(data, function(key, val) {
	
						// Ignore internal fields
						if(key[0] === '_') { return; }

						// Ignore user defined fields
						if($.inArray('*', fields_ignore) >= 0) { return; }
						if($.inArray(key, fields_ignore) >= 0) { return; }

						// Append div based on type
						var type = meta.getType(key);
						if( type && (typeof type === 'object') && type.type) {
							type = type.type;
						}
						if(exports.fields[type] && exports.fields[type].create) {
							$(form).append(exports.fields[type].create(key, val, meta, form_div));
						} else {
							$(form).append( $('<div class="field">').append( $('<p/>').text('Undefined #' + key + ' of type ' + JSON.stringify(type) ) ) );
						}
					});
					$(form).append( exports.fields.submit.create(undefined, undefined, $meta.parse(_form_meta), form_div) );
				});
			}

			$(form_div).append(form);
	};

	/** Initialize forms 
	 * @memberof module:nor-ui/form
	 */
	exports.init = function(obj) {

		/* Setup forms */
		$(obj).find(".form").each(function() {
			var form_div = this;
			exports.initForm(form_div);
		});
	
	};

	/** Create form 
	 * @memberof module:nor-ui/form
	 */
	exports.create = function(opts) {
		opts = opts || {};

		var success_fn;
		if(opts.success) {
			success_fn = opts.success;
			delete opts.success;
		}

		var data = {
			"action": opts.action,
			"method": opts.method || 'post',
			"fields-from": opts.fields_from,
			"fields-ignore": opts.fields_ignore
		};

		var div = $('<div class="form" />');
		$.each(data, function(key, value) {
			if(data[key]) {
				div.attr('data-'+key, value);
			}
		});
		exports.initForm(div, {'success':success_fn} );
		return div;
	};

	/* Initialize stuff after page is loaded */
	$(function () {
		exports.init(this);
	});

	// End of library code
	return exports;
});
/* EOF */
