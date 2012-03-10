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
			var imageUrl = this.getImageUrl(self.options.type);


			messageBox2(self.options.title, self.content, imageUrl, '', self.options.CloseButton);	
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


function messageBox2(title, message, imageUrl, buttonOKText, buttonCloseText, doneFunction) {
	var dialogView = "<div style='height:15px;'></div>";
		dialogView += "<div style='float:left;padding-left:5px;'>";
			dialogView += "<img src='" + imageUrl + "' />";
		dialogView += "</div>";
		dialogView += "<div style='float:left;' id='message'>";
			dialogView += "<p style='padding-left:20px; padding-top:6px;'>" + message + "</p>";
		dialogView += "</div>";

	var $win = dialogTemplate(title, dialogView);

	$win.dialog({
		height: 160,
		width: 320,
		resizable: false,
		modal: true,
		buttons:
			[{
				id:"btn-accept",
				text: buttonOKText,
				click: function() {
					doneFunction();
						$(this).dialog("close");
				}},
				{
				id:"btn-cancel",
				text: buttonCloseText,
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

function dialogTemplate(title, fieldset) {
	var $win = $("<div id='dialog-modal' title='" + title + "'><form style='height:100%;width:100%;'><fieldset><div></div></fieldset></form></div>");

	$win.find("form fieldset:first").replaceWith(fieldset);

	return $win;
}

})( jQuery, window, document );