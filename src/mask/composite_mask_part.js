    /**
    @@alias Part
    @@to Mask.CompositeMask.Part
    **/
    var Part = Mask.CompositeMask.Part;

    /**
    An object holding positioning information for the mask part

    @@field position
    @type Object
    **/
    Part.field("position", {});

    /**
    An object holding dimension information for the mask part

    @@field position
    @type Object
    **/
    Part.field("dimension", {});

    /**
    Renders the mask part

    @method render
    **/
    Part.method("render", function() {
        this.$el = $("<div>")
            .addClass("sideshow-mask-part")
            .addClass("sideshow-hidden")
            .addClass("sideshow-invisible");
        this.callSuper("render");
    });

    /**
    Updates the dimension and positioning of the subject mask part

    @method update
    @param {Object} position                              The positioning information 
    @param {Object} dimension                             The dimension information 
    **/
    Part.method("update", function(position, dimension) {
        this.position = position;
        this.dimension = dimension;
        this.$el
            .css("left", position.x)
            .css("top", position.y)
            .css("width", dimension.width)
            .css("height", dimension.height);
    });