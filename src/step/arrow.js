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
    The position of the arrow. Valid values are "top", "right", "bottom" or "left". Defaults to "top"

    @@field position
    @type String
    **/

    Arrow.field("position", "");

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
            .addClass(this.position)
            .addClass("sideshow-hidden")
            .addClass("sideshow-invisible");
        this.callSuper("render");
      //
    });

    /**
    Positionates the Arrow according to its target

    @method positionate
    **/
    Arrow.method("positionate", function() {
        var target = this.target,
            position = this.position;

        target.position = {
            x: target.$el.offset().left - $window.scrollLeft(),
            y: target.$el.offset().top - $window.scrollTop()
        };
        target.dimension = {
            width: parsePxValue(target.$el.outerWidth()),
            height: parsePxValue(target.$el.outerHeight())
        };

        var coordinates = { // a dictionary with each of the coordinates used for positioning Arrow
            top: {
                x: target.position.x + target.dimension.width / 2 - 20 + "px",
                y: target.position.y - 30 + "px"
            },
            right: {
                x: target.position.x + target.dimension.width - 12 + "px",
                y: target.position.y + target.dimension.height / 2 - 6 + "px"
            },
            bottom: {
                x: target.position.x + target.dimension.width / 2 - 35 + "px",
                y: target.position.y + target.dimension.height + 2 + "px"
            },
            left: {
                x: target.position.x - 35 + "px",
                y: target.position.y + target.dimension.height / 2 - 22 + "px"
            }
        };

      this.$el.css({left: coordinates[position].x, top: coordinates[position].y});
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
            this.target.position.y !== (this.target.$el.offset().top - $window.scrollTop())||
            this.target.position.x !== (this.target.$el.offset().left - $window.scrollLeft()));
    });
