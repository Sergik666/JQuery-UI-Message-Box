/*
 * JQuery UI Message Box v0.4.1
 * https://github.com/Sergik666/JQuery-UI-Message-Box
 *
 * Copyright 2012, Sergey Vasylchenko
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: March 10 11:03:03 2012 +0200
 */

(function ($, window, document, undefined) {

	var MessageBox = {
		init: function (options) {
			var self = this;

			self.content = (typeof options === 'string')
				? options
				: options.content;

			self.options = $.extend({}, $.showMessageBox.options, options);

			//console.log(self.options);

			this.initButtonsText();
		},
		initButtonsText: function () {
			var self = this;
			var type = self.options.type;
			if (type === 'question' && self.options.OkButtonText.length == 0) {
				self.options.OkButtonText = "OK";
			}
		},
		show: function () {
			var self = this;
			//console.log(self.options);
			var dialogContent = this.getDialogContent();

			var title = self.options.title;

			var messageBox = Object.create(MessageBoxDialog);

			messageBox.init({
				title: title,
				content: dialogContent,
				okButtonText: self.options.OkButtonText,
				OkButtonDoneFunction: self.options.OkButtonDoneFunction,
				NoButtonText: self.options.NoButtonText,
				NoButtonDoneFunction: self.options.NoButtonDoneFunction,
				closeButtonText: self.options.CloseButtonText,
				closeButtonDoneFunction: self.options.CloseButtonDoneFunction,
				AdditionalInformation: self.options.AdditionalInformation,
				AdditionalInformationShowText: self.options.AdditionalInformationShowText,
				AdditionalInformationHideText: self.options.AdditionalInformationHideText
			});
			messageBox.show();
		},
		getImageUrl: function () {
			var self = this;
			var type = self.options.type;
			var imagePath = self.options.imagePath;

			if (type === 'question')
				return imagePath + 'question.png';

			if (type === 'warning' || type === 'alert')
				return imagePath + 'warning.png';

			if (type === 'stop')
				return imagePath + 'stop.png';

			return imagePath + 'information.png';
		},
		getDialogContent: function () {
			var self = this;
			var imageUrl = this.getImageUrl();
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

	$.showMessageBox = function (options) {
		var messageBox = Object.create(MessageBox);

		messageBox.init(options);
		messageBox.show();
	};

	$.showMessageBox.options = {
		title: 'Information',
		OkButtonText: '',
		OkButtonDoneFunction: function () { },
		NoButtonText: '',
		NoButtonDoneFunction: function () { },
		CloseButtonText: 'Close',
		CloseButtonDoneFunction: function () { },
		type: 'Information',
		imagePath: '../src/img/',
		AdditionalInformation: '',
		AdditionalInformationShowText: 'Show additional info',
		AdditionalInformationHideText: 'Hide additional info'
	};

	var MessageBoxDialog = {
		init: function (options) {
			this.options = options;
			this.dialogTemplate = this.createDialogTemplate(options.title, options.content);
		},
		createDialogTemplate: function (title, content) {
			var result = "<div id='dialog-modal' title='" + title + "'>";
					result += "<div class='dialog-content' style='height:100%;width:100%;min-width:260px;'>";
						result += content;
					result += "</div>";
				result += "</div>";

			return result;
		},
		show: function () {
			var self = this;
			var $window = $(self.dialogTemplate);
			self.$window = $window;

			var closeFromButton = false;

			$window.dialog({
				width: 'auto',
				resizable: false,
				modal: true,
				buttons:
						[{
							id: "btn-showExtendData",
							text: self.options.AdditionalInformationShowText,
							click: function () {
								self.showOrHideAdditionalInformation();
							}
						},
						{
							id: "btn-accept",
							text: self.options.okButtonText,
							click: function () {
								self.options.OkButtonDoneFunction();
								closeFromButton = true;
								$(this).dialog("close");
							}
						},
						{
							id: "btn-no",
							text: self.options.NoButtonText,
							click: function () {
								self.options.NoButtonDoneFunction();
								closeFromButton = true;
								$(this).dialog("close");
							}
						},
						{
							id: "btn-cancel",
							text: self.options.closeButtonText,
							click: function () {
								self.options.closeButtonDoneFunction();
								closeFromButton = true;
								$(this).dialog("close");
							}
						}],
				create: function () {
					var $dialog = $(this).closest('.ui-dialog');

					$dialog.css('font-size', '62.5%');

					self.hideButtons($dialog);

					self.changeVisibilityAdditionalButton($dialog);
				},
				close: function () {
					if (!closeFromButton) {
						self.options.closeButtonDoneFunction();
					}
				}
			});

		},
		hideButtons: function ($dialog) {
			$dialog.find('.ui-button-text').each(function (index, item) {
				var $item = $(item);
				if (!$item.text())
					$item.parent().hide();
			});
		},
		changeVisibilityAdditionalButton: function ($dialog) {
			var self = this;
			var $buttonExtendedInfo = $dialog.find('#btn-showExtendData');
			if (self.options.AdditionalInformation.length != 0) {
				var $clonedButtonExtendedInfo = $buttonExtendedInfo.clone();
				$clonedButtonExtendedInfo.insertBefore($buttonExtendedInfo.parent());

				$clonedButtonExtendedInfo.click(function () {
					self.showOrHideAdditionalInformation();
				});

				$buttonExtendedInfo.remove();
			}
			else
				$buttonExtendedInfo.hide();
		},
		showOrHideAdditionalInformation: function () {
			var self = this;
			var $dialog = this.$window.closest('.ui-dialog');
			var $buttonpane = $dialog.find('.ui-dialog-buttonpane');
			var $buttonExtendedInfo = $dialog.find('#btn-showExtendData');

			if ($buttonpane.find('#extendInfo').length == 0) {
				$buttonpane.append('<div id="extendInfo"><br/><textarea style="min-width:400px;width:100%;height:150px;">' + self.options.AdditionalInformation + '</textarea><div>');
				$buttonpane.find('textarea').attr('readonly', 'readonly');
				$buttonExtendedInfo.find('.ui-button-text').text(self.options.AdditionalInformationHideText);
			}
			else {
				$buttonpane.find('#extendInfo').remove();
				$buttonExtendedInfo.find('.ui-button-text').text(self.options.AdditionalInformationShowText);
			}

			this.$window.dialog("option", "position", "center");
		}
	};

})(jQuery, window, document);