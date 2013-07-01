/* Modal Implementation */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["jquery"], function($) {
	"use strict";

   /** 
    * Implements file upload field
    * @memberof module:nor-ui.form.fields
	* @namespace file
    */
	var exports = {
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
		} // .create
	}; // exports

	// End of library code
	return exports;
});
/* EOF */
