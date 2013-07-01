/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

	/** 
	 * A modal implementation
	 * @module nor-ui/modal
	 * @namespace modal
	 */
	var exports = {};

	/** Enable or disable dismiss layer behind a modal
	 * @memberof module:nor-ui/modal
	 * @param modal
	 */
	exports.dismiss = function(modal){
		if(exports._dismiss) {
			$(exports._dismiss).remove();
			delete exports._dismiss;
		} else {
			var div = $('<div id="modal-dismiss" />');
			$(div).click(function() {
				exports.dismiss();
				if (modal) {
					$(modal).hide(); 
				}
			});
			$('body').append(div);
			exports._dismiss = div;
		}
	};

	/** Initialize a link 
	 * @memberof module:nor-ui/modal
	 * @param link
	 */
	exports.initLink = function(link) {
		$(link).click(function() {
			var href = $(link).attr('href');
			$(href).show();
			exports.dismiss(href);
			return false; // Returns false so the link does not do anything.
		});
	};
	
	/** Initialize a modal 
	 * @memberof module:nor-ui/modal
	 * @param modal
	 */
	exports.initModal = function(modal) {
		
		/* Setup links to close modals */
		$(modal).find("[data-dismiss='modal']").each(function() {
			var link = this;
			$(link).click(function() {
				var href = $(link).attr('href') || '#';
				if(href === '#') {
					$(modal).hide();
				} else {
					$(href).hide();
				}
				exports.dismiss();
				return false; // Returns false so the link does not do anything.
			});
		});
	};

	/** Initialize links and modals
	 * @memberof module:nor-ui/modal
	 */
	exports.init = function(obj) {

		/* Setup links to open modals */
		$(obj).find("[data-toggle='modal']").each(function() {
			exports.initLink(this);
		});

		/* Setup modals */
		$(obj).find(".modal").each(function() {
			exports.initModal(this);
		});

	};
	
	/** Dynamically create a modal
	 * @memberof module:nor-ui/modal
	 */
	exports.create = function(obj) {
		var div = $('<div class="modal" />');
		if(obj) {
			div.append($(obj));
		}
		div.hide();
		exports.initModal(div);
		$('body').append(div);
		return div;
	};

	/** Open a modal 
	 * @memberof module:nor-ui/modal
	 */
	exports.open = function(obj) {
		var div = $(obj);
		div.show();
		exports.dismiss(div);
		return div;
	};

	/** Close a modal 
	 * @memberof module:nor-ui/modal
	 */
	exports.close = function(div) {
		div = $(div);
		div.hide();
		exports.dismiss(div);
		return div;
	};

	/** Delete a modal 
	 * @memberof module:nor-ui/modal
	 */
	exports.del = function(div) {
		div = $(div);
		exports.close(div);
		$(div).remove();
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
