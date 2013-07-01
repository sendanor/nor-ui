/* Backend meta Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function() {
	"use strict";

   /** 
    * A module implementing metadata for JavaScript JSON files
    * @module nor-ui/meta
    */
	var exports = {};

	/** Meta object constructor
	 * @class
	 * @param data 
	 */	
	function Meta(data) {
		var self = this;
		self.data = data || {};
		self._meta = data._meta || {};

		self.types = self._meta.types;
		if(!self.types) {
			self.types = {};
		}
		
		self.translations = self._meta.translations;
		if(!self.translations) {
			self.translations = {};
		}
	}

	/** Get type for keyword */
	Meta.prototype.getType = function(key) {
		var self = this;
		if(self.types[key]) {
			return self.types[key];
		}
		var type = typeof self.data[key];
		if(type === 'string') {
			return 'text';
		} else {
			return type;
		}
	};

	/** Translate 
	 * @TODO Select language automatically
	 */
	Meta.prototype.t = function(key, lang) {
		var self = this;
		if(!lang) {
			// FIXME: Select language automatically
			lang = "fi";
		}
		if(!self.translations[lang]) {
			return key;
		}
		return self.translations[lang][key] || key;
	};

	/** Create metadata object */
	exports.parse = function(data) {
		return new Meta(data);
	};

	// End of library code
	return exports;
});
/* EOF */
