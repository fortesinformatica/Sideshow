	/**
	Controls the mask that covers the subject during a step transition

	@class SubjectMask
	@@singleton
	**/
	Mask.SubjectMask = jazz.Class().extending(FadableItem).singleton;

	/**
	Renders the subject mask

	@method render
	**/
	Mask.SubjectMask.method("render", function() {
	    this.$el = $("<div>").addClass("sideshow-subject-mask");
	    this.callSuper("render");
	});

	/**
	Updates the dimension, positioning and border radius of the subject mask

	@method update
	@param {Object} position                              The positioning information 
	@param {Object} dimension                             The dimension information 
	@param {Object} borderRadius                          The border radius information 
	**/
	Mask.SubjectMask.method("update", function(position, dimension, borderRadius) {
	    this.$el
	        .css("left", position.x)
	        .css("top", position.y)
	        .css("width", dimension.width)
	        .css("height", dimension.height)
	        .css("border-radius", borderRadius.leftTop + "px " + borderRadius.rightTop + "px " + borderRadius.leftBottom + "px " + borderRadius.rightBottom + "px ");
	});