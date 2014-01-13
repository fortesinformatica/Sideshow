    /**
    The main menu, where the available wizards are listed

    @class WizardMenu
    @static
    **/
    var WizardMenu = {};

    /**
    Renders the wizard menu

    @method render
    @param {Array} wizards                                The wizards list
    @static
    **/
    WizardMenu.render = function(wizards) {
        var $menu = $("<div>").addClass("sideshow-wizard-menu");
        this.$el = $menu;
        var $title = $("<h1>").addClass("sideshow-wizard-menu-title");
        $menu.append($title);

        if (wizards.length > 0) {
            var $wizardsList = $("<ul>");

            //Extracting this function to avoid the JSHint warning W083
            function setClick($wiz, wizard) {
                $wiz.click(function() {
                    WizardMenu.hide(function() {
                        currentWizard = wizard;
                        if (!currentWizard.isEligible()) {
                            if (currentWizard.preparation)
                                currentWizard.preparation(function() {
                                    wizard.play();
                                });
                            else
                                throw new SSException("203", "This wizard is not eligible neither has a preparation function.");
                        } else wizard.play();
                    });
                });
            }

            for (var w = 0; w < wizards.length; w++) {
                var wiz = wizards[w];
                var $wiz = $("<li>");
                var $wizTitle = $("<h2>").text(wiz.title);
                var $wizDescription = $("<span>").addClass("sideshow-wizard-menu-item-description").text(wiz.description);
                var $wizEstimatedTime = $("<span>").addClass("sideshow-wizard-menu-item-estimated-time").text(wiz.estimatedTime);
                $wiz.append($wizEstimatedTime, $wizTitle, $wizDescription);
                $wizardsList.append($wiz);

                setClick($wiz, wiz);
            }
            $menu.append($wizardsList);
        } else {
            $("<div>").addClass("sideshow-no-wizards-available").text(getString(strings.noAvailableWizards)).appendTo($menu);
        }

        $body.append($menu);
    };

    /**
    Shows the wizard menu

    @method show
    @param {Array} wizards                                The wizards list
    @static
    **/
    WizardMenu.show = function(wizards, title) {
        SS.setEmptySubject();
        Mask.CompositeMask.singleInstance.update(Subject.position, Subject.dimension, Subject.borderRadius);
        Mask.CompositeMask.singleInstance.fadeIn();
        WizardMenu.render(wizards);

        if (title)
            this.setTitle(title);
        else
            this.setTitle(getString(strings.availableWizards));
    };

    /**
    Hides the wizard menu

    @method hide
    @param {Function} callback                            The callback to be called after hiding the menu
    @static
    **/
    WizardMenu.hide = function(callback) {
        var menu = this;
        menu.$el.addClass("sideshow-menu-closed");
        setTimeout(function() {
            menu.$el.hide();
            if (callback) callback();
        }, longAnimationDuration);
    };

    WizardMenu.setTitle = function(title) {
        this.$el.find(".sideshow-wizard-menu-title").text(title);
    };
