	/**
	Step next button 

	@class StepDescriptionNextButton
	@extends HidableItem
	**/
	var StepDescriptionNextButton = jazz.Class().extending(HidableItem);

	/**
	The text for the next button

	@@field _text
	@private
	**/
	StepDescriptionNextButton.field("_text");

	/**
	Disables the next button

	@method disable
	**/
	StepDescriptionNextButton.method("disable", function() {
	    this.$el.attr("disabled", "disabled");
	});

	/**
	Enables the next button

	@method enable
	**/
	StepDescriptionNextButton.method("enable", function() {
	    this.$el.attr("disabled", null);
	});

	/**
	Sets the text for the next button

	@method setText
	@param {String} text                                  The text for the next button
	**/
	StepDescriptionNextButton.method("setText", function(text) {
	    this._text = text;
	    this.$el.text(text);
	});

	/**
	Renders the Next Button

	@method render
	@param {Object} $stepDescriptionEl                    The jQuery wrapped DOM element for the Step Description panel
	**/
	StepDescriptionNextButton.method("render", function($stepDescriptionEl) {
	    this.$el = $("<button>").addClass("sideshow-next-step-button");
	    this.callSuper("render", $stepDescriptionEl);
	});