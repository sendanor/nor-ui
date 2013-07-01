/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * A modal implementation
    * @exports nor-ui/modal
    * @version 0.1.0
	* @namespace nor-ui
    */
	var $modal = {};

	/** Enable or disable dismiss layer behind a modal
	*@memberof modal
	*@param modal
	*/
	$modal.dismiss = function(modal){
		if($modal._dismiss) {
			$($modal._dismiss).remove();
			delete $modal._dismiss;
		} else {
			var div = $('<div id="modal-dismiss" />');
			$(div).click(function() {
				$modal.dismiss();
				if (modal) {
					$(modal).hide(); 
				}
			});
			$('body').append(div);
			$modal._dismiss = div;
		}
	};

	/** Initialize a link 
	*@memberof modal
	*@inner
	*@param link
	*/
	$modal.initLink = function(link) {
		$(link).click(function() {
			var href = $(link).attr('href');
			$(href).show();
			$modal.dismiss(href);
			return false; // Returns false so the link does not do anything.
		});
	};
	
	/** Initialize a modal 
	*@memberof modal
	*@inner
	*@param modal
	*/
	$modal.initModal = function(modal) {
		
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
				$modal.dismiss();
				return false; // Returns false so the link does not do anything.
			});
		});
	};

	/* Initialize links and modals */
	$modal.init = function(obj) {

		/* Setup links to open modals */
		$(obj).find("[data-toggle='modal']").each(function() {
			$modal.initLink(this);
		});

		/* Setup modals */
		$(obj).find(".modal").each(function() {
			$modal.initModal(this);
		});

	};
	
	/** Dynamically create a modal
	 */
	$modal.create = function(obj) {
		var div = $('<div class="modal" />');
		if(obj) {
			div.append($(obj));
		}
		div.hide();
		$modal.initModal(div);
		$('body').append(div);
		return div;
	};

	/** Open a modal 
	 */
	$modal.open = function(obj) {
		var div = $(obj);
		div.show();
		$modal.dismiss(div);
		return div;
	};

	/** Close a modal 
	 */
	$modal.close = function(div) {
		div = $(div);
		div.hide();
		$modal.dismiss(div);
		return div;
	};

	/** Delete a modal 
	 */
	$modal.del = function(div) {
		div = $(div);
		$modal.close(div);
		$(div).remove();
		return div;
	};

	/* Initialize stuff after page is loaded */
	$(function () {
		$modal.init(this);
	});

	// End of library code
	return $modal;
});
/* EOF */
