	/**
	A visual item which can be shown and hidden

	@class HidableItem
	@@abstract
	@extends VisualItem
	**/
	var HidableItem = jazz.Class().extending(VisualItem).abstract;

	/**
	Shows the visual item

	@method show
	@param {boolean} displayButKeepTransparent            The item will hold space but keep invisible
	**/
	HidableItem.method("show", function(displayButKeepTransparent) {
	    if (!this.$el) this.render();
	    if (!displayButKeepTransparent) this.$el.removeClass("sideshow-invisible");
	    this.$el.removeClass("sideshow-hidden");
	    this.status = AnimationStatus.VISIBLE;
	});

	/**
	Hides the visual item

	@method hide
	**/
	HidableItem.method("hide", function(keepHoldingSpace) {
	    if (!keepHoldingSpace) this.$el.addClass("sideshow-hidden");
	    this.$el.addClass("sideshow-invisible");
	    this.status = AnimationStatus.NOT_DISPLAYED;
	});