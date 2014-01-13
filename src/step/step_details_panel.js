    /**
    The panel that holds step description, is positionated over the biggest remaining space among the four parts of a composite mask

    @class DetailsPanel
    @@singleton
    @extends FadableItem
    **/
    var DetailsPanel = jazz.Class().extending(FadableItem).singleton;

    /**
    An object holding dimension information for the Details Panel

    @@field dimension
    @type Object
    **/
    DetailsPanel.field("dimension", {});

    /**
    An object holding positioning information for the Details Panel

    @@field position
    @type Object
    **/
    DetailsPanel.field("position", {});

    /**
    Renders the Details Panel

    @method render
    **/
    DetailsPanel.method("render", function() {
        this.$el = $("<div>")
            .addClass("sideshow-details-panel")
            .addClass("sideshow-hidden");
        this.callSuper("render");
    });

    /**
    Positionates the panel automatically, calculating the biggest available area and putting the panel over there

    @method positionate
    **/
    DetailsPanel.method("positionate", function() {
        var parts = Mask.CompositeMask.singleInstance.parts;

        //Considering the four parts surrounding the current subject, gets the biggest one
        var biggestSide = [
            [parts.top, "height"],
            [parts.right, "width"],
            [parts.bottom, "height"],
            [parts.left, "width"]
        ].sort(function(a, b) {
            return a[0].dimension[a[1]] > b[0].dimension[b[1]];
        }).slice(-1)[0];

        if (biggestSide[1] == "width") {
            this.$el
                .css("left", biggestSide[0].position.x).css("top", 0)
                .css("height", Screen.dimension.height).css("width", biggestSide[0].dimension.width);
        } else {
            this.$el
                .css("left", 0).css("top", biggestSide[0].position.y)
                .css("height", biggestSide[0].dimension.height).css("width", Screen.dimension.width);
        }

        this.dimension = {
            width: parsePxValue(this.$el.css("width")),
            height: parsePxValue(this.$el.css("height"))
        };

        this.position = {
            x: parsePxValue(this.$el.css("left")),
            y: parsePxValue(this.$el.css("top"))
        };
    });