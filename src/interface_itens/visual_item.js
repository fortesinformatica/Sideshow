	/**
	A visual item 

	@class VisualItem
	@@abstract
	**/
	var VisualItem = jazz.Class().abstract;

	/**
	The jQuery wrapped DOM element for the visual item

	@@field $el
	@type Object 
	**/
	VisualItem.field("$el");

	/**
	The jQuery wrapped DOM element for the visual item

	@@field $el
	@type AnimationStatus 
	**/
	VisualItem.field("status", AnimationStatus.NOT_RENDERED);

	/**
	Renders the item's DOM object

	@method render
	**/
	VisualItem.method("render", function($parent) {
	    ($parent || $body).append(this.$el);
	    this.status = AnimationStatus.NOT_DISPLAYED;
	});

	/**
	Destroys the item's DOM object

	@method destroy
	**/
	VisualItem.method("destroy", function() {
	    this.$el.remove();
	});