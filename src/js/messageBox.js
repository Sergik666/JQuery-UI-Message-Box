/*
 * JQuery UI Message Box v0.1
 * https://github.com/Sergik666/JQuery-UI-Message-Box
 *
 * Copyright 2012, Sergey Vasylchenko
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: March 10 11:03:03 2012 +0200
 */

/*// Utility
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}*/


(function( $, window, document, undefined ) {

	var MessageBox = {
		init: function( options) {
			var self = this;

			self.content = ( typeof options === 'string' )
				? options
				: options.content;

			self.options = $.extend( {}, $.showMessageBox.options, options );
			console.log(self.options);
		},
		show: function() {
			var self = this;
			//console.log(self.options);
			var dialogContent = this.getDialogContent();

			var title = self.options.title;

			var messageBox = Object.create( MessageBoxDialog );
			
			messageBox.init( {title : title, content : dialogContent } );
			messageBox.show();

			//messageBox2(self.options.title, dialogContent, '', self.options.CloseButton);	
		},
		getImageUrl : function(type){
			var self = this;
			var imagePath = self.options.imagePath;

			if(type === 'question')
				return imagePath + 'question.png';

			if(type === 'warning')
				return imagePath + 'warning.png'

			if(type === 'stop')
				return imagePath + 'stop.png'

			return imagePath + 'information.png'
		},
		getDialogContent : function(){
			var self = this;
			var imageUrl = this.getImageUrl(self.options.type);
			var content = self.content;

			var dialogView = "<div style='height:15px;'></div>";
				dialogView += "<div style='float:left;padding-left:5px;'>";
					dialogView += "<img src='" + imageUrl + "' />";
				dialogView += "</div>";
				dialogView += "<div style='float:left;' id='content'>";
					dialogView += "<p style='padding-left:20px; padding-top:6px;'>" + content + "</p>";
				dialogView += "</div>";

			return dialogView;
		}
	};

	$.showMessageBox = function( options ) {
			var messageBox = Object.create( MessageBox );
			
			messageBox.init( options );
			messageBox.show();
	};

	$.showMessageBox.options = {
		title: 'Information',
		CloseButton: 'Close',
		type: 'Information',
		imagePath: '../src/img/'
	};

	var MessageBoxDialog = {
		init:function(options){
			this.dialogTemplate = this.createDialogTemplate(options.title, options.content);
		},
		createDialogTemplate:function(title, content){
			var result = "<div id='dialog-modal' title='" + title + "'>";
					result += "<div style='height:100%;width:100%;'>";
						result += content;
					result += "</div>";
				result += "</div>";

			return result;
		},
		show:function(){
			var $window = $(this.dialogTemplate);

			$window.dialog({
					height: 160,
					width: 320,
					resizable: false,
					modal: true,
					buttons:
						[{
							id:"btn-accept",
							text: "",//buttonOKText,
							click: function() {
								doneFunction();
									$(this).dialog("close");
							}},
							{
							id:"btn-cancel",
							text: "Close",//buttonCloseText,
							click: function() {
									$(this).dialog("close");
							}
						}],
					create: function () {
						var $dialog = $(this).closest('.ui-dialog');
						$dialog.css('font-size', '62.5%');
						$dialog.find('.ui-button-text').each(function (index, item) {
							var $item = $(item);
							if (!$item.text())
								$item.parent().hide();
						});
					}
				});

		}
	};

})( jQuery, window, document );