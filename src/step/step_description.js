    /**
    Represents a panel holding the step description

    @class StepDescription
    @extends FadableItem
    @@initializer
    **/
    var StepDescription = jazz.Class(function() {
        this.nextButton = StepDescriptionNextButton.build();
    }).extending(FadableItem).singleton;

    /**
    The step description text content

    @@field text
    @type String
    **/
    StepDescription.field("text", "");

    /**
    The title text for the step description panel

    @@field title
    @type String
    **/
    StepDescription.field("title", "");

    /**
    An object holding dimension information for the Step Description panel

    @@field dimension
    @type Object
    **/
    StepDescription.field("dimension", {});

    /**
    An object holding positioning information for the Step Description panel

    @@field position
    @type Object
    **/
    StepDescription.field("position", {});

    /**
    An object representing the next button for a step description panel 

    @@field nextButton
    @type Object
    **/
    StepDescription.field("nextButton");

    /**
    Sets the text for the step description panel

    @method setText
    @param {String} text                                  The text for the step description panel
    **/
    StepDescription.method("setText", function(text) {
        this.text = text;
        this.$el.find(".sideshow-step-text").text(text);
    });

    /**
    Sets the HTML content for the step description panel

    @method setHTML
    @param {String} text                                  The HTML content for step description panel
    **/
    StepDescription.method("setHTML", function(text) {
        this.text = text;
        this.$el.find(".sideshow-step-text").html(text);
    });

    /**
    Sets the title for the step description panel

    @method setTitle
    @param {String} title                                 The text for the step description panel
    **/
    StepDescription.method("setTitle", function(title) {
        this.title = title;
        this.$el.find("h2:first").text(title);
    });

    /**
    Sets the title for the step description panel

    @method setStepPosition
    @param {String} title                                 The text for the step description panel
    **/
    StepDescription.method("setStepPosition", function(stepPosition) {
        this.stepPosition = stepPosition;
        this.$el.find(".sideshow-step-position").text(stepPosition);
    });

    /**
    Renders the step description panel

    @method render
    **/
    StepDescription.method("render", function() {
        this.$el = $("<div>")
            .addClass("sideshow-step-description")
            .addClass("sideshow-hidden")
            .addClass("sideshow-invisible");

        var stepPosition = $("<span>").addClass("sideshow-step-position");
        this.$el.append(stepPosition);
        if (currentWizard.showStepPosition === false) stepPosition.hide();

        // Check if close button should be on step
        if (SS.config.closeButtonPosition === 'description-box') {
            // render the close button on the step
            var $closeStep = $("<button>")
                .addClass("sideshow-close-step")
                .click(function () {
                    SS.close();
                });

            this.$el.append($closeStep);
        }

        this.$el.append($("<h2>"));
        this.$el.append($("<div>").addClass("sideshow-step-text"));
        this.nextButton.render(this.$el);
        this.nextButton.$el.click(function() {
            currentWizard.next();
        });
        DetailsPanel.singleInstance.$el.append(this.$el);
    });

    /**
    Shows the step description panel

    @method show
    **/
    StepDescription.method("show", function(displayButKeepTransparent) {
        this.callSuper("show", displayButKeepTransparent);
        //this.positionate();
    });

    /**
    Positionates the step description panel

    @method positionate
    **/
    StepDescription.method("positionate", function() {
        var dp = DetailsPanel.singleInstance;

        if (dp.dimension.width >= 900)
            this.dimension.width = 900;
        else
            this.dimension.width = dp.dimension.width * 0.9;

        this.$el.css("width", this.dimension.width);

        var paddingLeftRight = (parsePxValue(this.$el.css("padding-left")) + parsePxValue(this.$el.css("padding-right"))) / 2;
        var paddingTopBottom = (parsePxValue(this.$el.css("padding-top")) + parsePxValue(this.$el.css("padding-bottom"))) / 2;

        this.dimension.height = parsePxValue(this.$el.outerHeight());

        //Checks if the description dimension overflow the available space in the details panel
        if (this.dimension.height > dp.dimension.height || this.dimension.width < 400) {
            this.dimension.width = $window.width() * 0.9;
            this.$el.css("width", this.dimension.width);
            this.dimension.height = parsePxValue(this.$el.outerHeight());

            this.position.x = ($window.width() - this.dimension.width) / 2;
            this.position.y = ($window.height() - this.dimension.height) / 2;
        } else {
            this.position.x = (dp.dimension.width - this.dimension.width) / 2;
            this.position.y = (dp.dimension.height - this.dimension.height) / 2;
        }

        this.$el.css("left", this.position.x - paddingLeftRight);
        this.$el.css("top", this.position.y - paddingTopBottom);
    });
