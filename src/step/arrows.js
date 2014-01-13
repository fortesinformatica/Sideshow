    /**
    Class representing all the current shown arrows

    @class Arrows
    @static
    **/
    var Arrows = {};

    zzz = Arrows;
    Arrows.arrows = [];

    /**
    Clear the currently defined arrows

    @method clear
    @static
    **/
    Arrows.clear = function() {
        this.arrows = [];
    };

    /**
    Sets the targets for arrows to point

    @method setTargets
    @static
    **/
    Arrows.setTargets = function(targets) {
        if (targets.constructor === String) targets = $(targets);

        if (targets instanceof $ && targets.length > 0) {
            targets.each(function() {
                var arrow = Arrow.build();
                arrow.target.$el = $(this);
                if (arrow.target.$el.is(":visible")) {
                    Arrows.arrows.push(arrow);
                    arrow.onceVisible = true;
                }
            });
        } else {
            throw new SSException("150", "Invalid targets.");
        }
    };

    Arrows.recreateDOMReferences = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            arrow.$el.remove();
        }

        Arrows.clear();
        Arrows.setTargets(currentWizard.currentStep.targets);
        Arrows.render();
        Arrows.positionate();
        Arrows.show();
    };

    /**
    Iterates over the arrows collection showing each arrow

    @method show
    @static
    **/
    Arrows.show = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            arrow.show();
        }
    };

    /**
    Iterates over the arrows collection hiding each arrow

    @method hide
    @static
    **/
    Arrows.hide = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            arrow.hide();
        }
    };

    /**
    Iterates over the arrows collection fading in each arrow

    @method fadeIn
    @static
    **/
    Arrows.fadeIn = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            arrow.fadeIn();
        }
    };

    /**
    Iterates over the arrows collection fading out each arrow

    @method fadeOut
    @static
    **/
    Arrows.fadeOut = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            registerFadeOut(arrow);
        }

        function registerFadeOut(arrow) {
            arrow.fadeOut(function() {
                arrow.destroy();
            });
        }
    };

    /**
    Iterates over the arrows collection repositionating each arrow

    @method positionate
    @static
    **/
    Arrows.positionate = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            arrow.positionate();
        }
    };

    /**
    Iterates over the arrows collection rendering each arrow

    @method render
    @static
    **/
    Arrows.render = function() {
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            arrow.render();
        }
    };

    /**
    A Polling function to check if arrows coordinates has changed

    @method pollForArrowsChanges
    **/
    Arrows.pollForArrowsChanges = function() {
        var brokenReference = false;
        for (var a = 0; a < this.arrows.length; a++) {
            var arrow = this.arrows[a];
            if (arrow.hasChanged()) arrow.positionate();
            if (arrow.onceVisible && !arrow.target.$el.is(":visible")) brokenReference = true;
        }

        if (brokenReference) this.recreateDOMReferences();
    };