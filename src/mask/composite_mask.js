    /**
    Controls the mask surrounds the subject (the step focussed area)

    @class CompositeMask
    @@singleton
    **/
    Mask.CompositeMask = jazz.Class().extending(FadableItem).singleton;

    /**
    Initializes the composite mask

    @method init
    **/
    Mask.CompositeMask.method("init", function() {
        var mask = this;
        ["top", "left", "right", "bottom"].forEach(function(d) {
            mask.parts[d] = Mask.CompositeMask.Part.build();
        });
        ["leftTop", "rightTop", "leftBottom", "rightBottom"].forEach(function(d) {
            mask.parts[d] = Mask.CompositeMask.CornerPart.build();
        });
    });

    /**
    The parts composing the mask

    @@field parts
    @type Object
    **/
    Mask.CompositeMask.field("parts", {});

    /**
    Renders the composite mask 

    @method render
    **/
    Mask.CompositeMask.method("render", function() {
        var mask = this;
        for (var p in this.parts) {
            var part = this.parts[p];
            if (part.render) part.render();
        }
        this.$el = $(".sideshow-mask-part, .sideshow-mask-corner-part");
        // if(!this.$el || this.$el.length === 0) this.$el = $(".sideshow-mask-part, .sideshow-mask-corner-part");
        Mask.SubjectMask.singleInstance.render();
        ["leftTop", "rightTop", "leftBottom", "rightBottom"].forEach(function(d) {
            mask.parts[d].$el.addClass(d);
        });
        this.status = AnimationStatus.NOT_DISPLAYED;
    });

    /**
    Updates the positioning and dimension of each part composing the whole mask, according to the subject coordinates

    @method update
    @param {Object} position                              An object representing the positioning info for the mask
    @param {Object} dimension                             An object representing the dimension info for the mask
    @param {Object} borderRadius                          An object representing the borderRadius info for the mask
    **/
    Mask.CompositeMask.method("update", function(position, dimension, borderRadius) {
        Mask.SubjectMask.singleInstance.update(position, dimension, borderRadius);

        //Aliases
        var left = position.x,
            top = position.y,
            width = dimension.width,
            height = dimension.height,
            br = borderRadius;

        //Updates the divs surrounding the subject
        this.parts.top.update({
            x: 0,
            y: 0
        }, {
            width: $body.width(),
            height: top
        });
        this.parts.left.update({
            x: 0,
            y: top
        }, {
            width: left,
            height: height
        });
        this.parts.right.update({
            x: left + width,
            y: top
        }, {
            width: $body.width() - (left + width),
            height: height
        });
        this.parts.bottom.update({
            x: 0,
            y: top + height
        }, {
            width: $body.width(),
            height: $body.height() - (top + height)
        });

        //Updates the Rounded corners
        this.parts.leftTop.update({
            x: left,
            y: top
        }, br.leftTop);
        this.parts.rightTop.update({
            x: left + width - br.rightTop,
            y: top
        }, br.rightTop);
        this.parts.leftBottom.update({
            x: left,
            y: top + height - br.leftBottom
        }, br.leftBottom);
        this.parts.rightBottom.update({
            x: left + width - br.rightBottom,
            y: top + height - br.rightBottom
        }, br.rightBottom);
    });

    /**
    A Polling function to check if subject coordinates has changed

    @method pollForChanges
    **/
    Mask.CompositeMask.method("pollForChanges", function() {
        if (!flags.lockMaskUpdate) {
            if (currentWizard && currentWizard.currentStep.subject) {
                var subject = $(currentWizard.currentStep.subject);
                if (Subject.obj[0] !== subject[0]) SS.setSubject(subject);
            }

            if (Subject.hasChanged()) {
                Subject.updateInfo();
                this.update(Subject.position, Subject.dimension, Subject.borderRadius);
            }
        }

        if (Screen.hasChanged()) {
            Screen.updateInfo();
            this.update(Subject.position, Subject.dimension, Subject.borderRadius);
        }
    });

    /**
    A part composing the mask

    @class Part
    @@initializer 
    @param {Object} position                              The positioning information 
    @param {Object} dimension                             The dimension information 
    **/
    Mask.CompositeMask.Part = jazz.Class(function(position, dimension) {
        this.position = position;
        this.dimension = dimension;
    }).extending(VisualItem);