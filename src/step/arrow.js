    /**
    A single arrow for pointing individual items in current subject 

    @class Arrow
    **/
    var Arrow = jazz.Class().extending(FadableItem);

    /**
    The jQuery wrapped object which will be pointed by this arrow

    @@field target
    @type Object
    **/
    Arrow.field("target", {});

    /**
    Flag created to set if the arrow was visible once, this is used for recreating references to the targets DOM objects

    @@field onceVisible
    @type Object
    **/
    Arrow.field("onceVisible", false);

    /**
    Renders the Arrow

    @method render
    **/
    Arrow.method("render", function() {
        this.$el = $("<div>")
            .addClass("sideshow-subject-arrow")
            .addClass("sideshow-hidden")
            .addClass("sideshow-invisible");
        this.callSuper("render");
    });

    /**
    Positionates the Arrow according to its target

    @method positionate
    **/
    Arrow.method("positionate", function() {
        var target = this.target;
        target.position = {
            x: target.$el.offset().left,
            y: target.$el.offset().top
        };
        target.dimension = {
            width: target.$el.outerWidth(),
            height: target.$el.outerHeight()
        };

        this.$el.css("top", target.position.y - 30 + "px")
            .css("left", target.position.x + (parsePxValue(target.dimension.width) / 2) - 12 + "px");
    });

    /**
    Shows the Arrow 

    @method show
    **/
    Arrow.method("show", function() {
        this.callSuper("show");
        this.positionate();
    });

    /**
    Does a fade in transition in the Arrow 

    @method fadeIn
    **/
    Arrow.method("fadeIn", function() {
        this.callSuper("fadeIn");
        this.positionate();
    });

    /**
    Checks if the arrow's target position or dimension has changed

    @method hasChanged
    @return boolean                                     
    **/
    Arrow.method("hasChanged", function() {
        return (this.target.dimension.width !== this.target.$el.outerWidth() ||
            this.target.dimension.height !== this.target.$el.outerHeight() ||
            this.target.position.y !== this.target.$el.offset().top ||
            this.target.position.x !== this.target.$el.offset().left);
    });