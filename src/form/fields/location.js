/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements location selection field by using Google Maps. Please view Google's Terms of Use before using it!
    * @memberof module:nor-ui.fields
	* @namespace location
	* @todo Move Google Maps features to external git repository / implement prefered way of extending features
    */
	var exports = {
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
		} // create
	}; // exports

	// End of library code
	return exports;
});
/* EOF */
