/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery", "./client", "./meta"], function($, $client, $meta) {
	"use strict";

   /** 
    * A module implementing forms.
    * @module nor-ui/form
    */
	var exports = {
		'fields': {}
	};

	/** Default metadata for forms
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
	
	/** Implementations of field types */
	exports.fields = {
		// Hidden field
		'hidden' : {
			'create': function(key, value, meta) {
				// FIXME: Maybe jquery could be avoided by using some other way
				var div = $('<div class="field hide" />');
				var input = $('<input type="hidden"/>').attr('value', value).attr('name', key);
				div.append(input);
				return div;
			}
		},
		// Location field
		// FIXME: Move Google Maps features to external module / implement modular way of extending features
		'location' : {
			'create': function(key, value, meta) {
				var div = $('<div class="field location" />');
				var label = $('<label/>').text(meta.t(key));
				var input_lat = $('<input type="hidden"/>').attr('value', value.lat).attr('name', 'pos_lat');
				var input_long = $('<input type="hidden"/>').attr('value', value.long).attr('name', 'pos_long');
				var content_div = $('<div class="field-content"  />');
				var map_div = $('<div class="map" />');
				content_div.append(input_lat);
				content_div.append(input_long);
				content_div.append(map_div);
				div.append(label);
				div.append(content_div);

				var lat, long;
				if(value && value.lat) {
					lat = parseFloat(value.lat);
				} else {
					lat = 65;
				}
				if( (lat === 0) || (lat === "0") ) { lat = 65; }

				if(value && value.long) {
					long = parseFloat(value.long);
				} else {
					long = 26;
				}
				if( (long === 0) || (long === "0") ) { long = 26; }
				
				function initialize() {

					//alert("lat=" + lat + ", long=" + long);

					var mapOptions = {
						zoom: 4,
						center: new google.maps.LatLng(lat, long),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					var map = new google.maps.Map(map_div.get(0), mapOptions);
					
					var store = {}, position;
					if(lat && long) {
						position = new google.maps.LatLng(lat, long);
						store.marker = new google.maps.Marker({
							position: position,
							map: map
						});
						map.panTo(position);
						$(input_lat).attr('value', lat);
						$(input_long).attr('value', long);
					}

					google.maps.event.addListener(map, 'click', function(e) {
						var position = e.latLng;
						var m = new google.maps.Marker({
							position: position,
							map: map
						});
						map.panTo(position);

						if(store.marker) {
							store.marker.setMap(null);
							delete store.marker;
						}
						store.marker = m;

						$(input_lat).attr('value', position.lat());
						$(input_long).attr('value', position.lng());
					});

				}

				//google.maps.event.addDomListener($(div).get(), 'load', initialize);

				function delayed_initialize_if_visible(div) {
					if( $(div).is(':visible') ) {
						//alert("map div visible");
						setTimeout(function() {
							initialize();
						}, 100);
						return;
					}
					setTimeout(function() {
						delayed_initialize_if_visible(div);
					}, 500);
				}

				$(div).ready(function() {
					//alert("map div ready");
					delayed_initialize_if_visible(div);
				});

				return div;
			}
		},
		// File field
		'file' : {
			'create': function(key, value, meta, parent_div) {
				var type = meta.getType(key);
				var div = $('<div class="field file" />');
				var label = $('<label/>').text(meta.t(key));
				var form_div = $('<div class="subform field-content" />');
				var input = $('<input type="file" />').attr('name', key);
				var form = $('<form enctype="multipart/form-data" />');
				form.append( $('<input type="hidden" name="MAX_FILE_SIZE" value="10485760" />') );
				var progress = $('<progress/>');
				var status = $('<div class="status"/>');
				var form_action = $(parent_div).attr('data-action');

				status.hide();
				progress.hide();

				form.append( $('<input type="hidden" name="_action" value="put" />') );
				form.append(input);
				form_div.append(form);
				form_div.append(progress);
				form_div.append(status);

				div.append(label);
				div.append(form_div);

				// Parse action
				var url_parts = form_action.split('?');
				var url_base = url_parts.shift();
				var url_params = url_parts.join('?');

				function progressHandlingFunction(e){
					if(e.lengthComputable){
						progress.attr({value:e.loaded,max:e.total});
					}
				}
				
				input.change(function(){
					var file = this.files[0];
					var ext = file.name.split('.').reverse()[0];
					var formData = new FormData(form[0]);

					var url = url_base+'/'+encodeURIComponent(key)+'.'+encodeURIComponent(ext);
					if(url_params) {
						url += '?' + url_params;
					}

					$.ajax({
						url: url,
						type: 'POST',
						xhr: function() {  // custom xhr
							var myXhr = $.ajaxSettings.xhr();
							if(myXhr.upload){ // check if upload property exists
								myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
							}
							return myXhr;
						},
						beforeSend: function() {
							progress.show();
						},
						success: function() {
							progress.hide();
							// FIXME: Implement some kind of notice when ready
							status.attr('class', 'success');
							status.text('OK');
							status.show();
						},
						error: function() {
							// FIXME: Implement better error messages
							progress.hide();
							status.text("ERROR");
							status.attr('class', 'fail');
							status.show();
						},
						data: formData,
						cache: false,
						contentType: false,
						processData: false
					});
				});

				return div;
			}
		},
		// Text field
		'multi' : {
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
			}
		},
		// Year field
		'year' : {
			'create': function(key, value, meta) {
				return exports.fields.multi.create(key, value, $meta.parse(_form_meta) );
			}
		},
		// Text field
		'text' : {
			'create': function(key, value, meta) {
				var div = $('<div class="field text" />');
				var label = $('<label/>').text(meta.t(key));
				var input = $('<input type="text"/>').attr('value', value).attr('name', key);
				div.append(label);
				div.append(input);
				return div;
			}
		},
		// Textarea field
		'textarea' : {
			'create': function(key, value, meta) {
				var div = $('<div class="field textarea" />');
				var label = $('<label/>').text(meta.t(key));
				var input = $('<textarea>').attr('name', key).text(value);
				div.append(label);
				div.append(input);
				return div;
			}
		},
		// Submit button
		'submit' : {
			'create': function(key, value, meta) {
				return $('<div class="field buttons" />').append( $('<input class="btn" type="submit">').attr('value', meta.t('submit')) );	
			}
		}
	};

	/**
	 * @callback form~successCallback
	 * @param {object} form - HTML element
	 */
	
	/**
	 * @typedef form~options
	 * @type {object}
	 * @property {form~successCallback} success - Callback which will be called after the form has been built.
	 */

	/** Initialize forms 
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
	 */
	exports.init = function(obj) {

		/* Setup forms with data */
		$(obj).find(".form").each(function() {
			var form_div = this;
			exports.initForm(form_div);
		});
	
	};

	/** Create form 
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
