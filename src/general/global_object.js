    /**
    Initializes Sideshow

    @method init
    @static
    **/
    SS.init = function() {
        $window = $(global);
        $document = $(global.document);
        $body = $("body", global.document);
        registerGlobalHotkeys();
        Polling.start();
        Mask.CompositeMask.singleInstance.init();
        flags.lockMaskUpdate = true;
        Mask.CompositeMask.singleInstance.render();
    };

    /**
    Receives a function with just a multiline comment as body and converts to a here-document string

    @method heredoc
    @param {Function}                                     A function without body but a multiline comment
    @return {String}                                      A multiline string
    @static
    **/
    SS.heredoc = function(fn) {
        return fn.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    }

    /**
    Stops and Closes Sideshow

    @method closes
    @static
    **/
    SS.close = function() {
        if (!currentWizard) WizardMenu.hide();

        DetailsPanel.singleInstance.fadeOut();

        this.CloseButton.singleInstance.fadeOut();
        Arrows.fadeOut();

        setTimeout(function() {
            if (Mask.CompositeMask.singleInstance.status === AnimationStatus.VISIBLE ||
                Mask.CompositeMask.singleInstance.status === AnimationStatus.FADING_IN)
                Mask.CompositeMask.singleInstance.fadeOut();

            Mask.SubjectMask.singleInstance.fadeOut();

        }, longAnimationDuration);

        removeDOMGarbage();
        Polling.clear();
        SS.ControlVariables.clear();
        unregisterInnerHotkeys();
        currentWizard = null;
        flags.running = false;
    };

    /**
    @deprecated
    @method runWizard
    @static
    **/
    SS.runWizard = function (name) {
        showDeprecationWarning("This method is deprecated and will be removed until the next major version of Sideshow.");

        var wiz = wizards.filter(function (w) {
            return w.name === name
        })[0];
        currentWizard = wiz;
        if (wiz) {
            if (wiz.isEligible()) wiz.play();
            else if (wiz.preparation) wiz.preparation(function () {
                setTimeout(function () {
                    wiz.play();
                }, 1000);
            });
            else throw new SSException("204", "This wizard hasn't preparation.");
        } else throw new SSException("205", "There's no wizard with name " + name + ".");
    };

    SS.gotoStep = function() {
        var firstArg = arguments[0],
            steps = currentWizard._storyline.steps,
            destination;

        flags.skippingStep = true;

        //First argument is the step position (1-based)
        if (typeof firstArg == "number") {
            if (firstArg <= steps.length)
                destination = steps[firstArg - 1];
            else
                throw new SSException("401", "There's no step in the storyline with position " + firstArg + ".");
        } //First argument is the step name
        else if (typeof firstArg == "string") {
            destination = steps.filter(function(i) {
                return i.name === firstArg;
            })[0];

            if (!destination) throw new SSException("401", "There's no step in the storyline with name " + firstArg + ".");
        }
        setTimeout(function() {
            currentWizard.next(null, destination);
        }, 100);
    };

    /**
    A trick to use the composite mask to simulate the behavior of a solid mask, setting an empty subject

    @method setEmptySubject
    @static
    **/
    SS.setEmptySubject = function() {
        flags.lockMaskUpdate = true;
        Subject.obj = null;
        Subject.updateInfo({
            dimension: {
                width: 0,
                height: 0
            },
            position: {
                x: 0,
                y: 0
            },
            borderRadius: {
                leftTop: 0,
                rightTop: 0,
                leftBottom: 0,
                rightBottom: 0
            }
        });
    };

    /**
    Sets the current subject

    @method setSubject
    @param {Object} subj
    @static
    **/
    SS.setSubject = function(subj, subjectChanged) {
        if (subj.constructor === String) subj = $(subj);

        if (subj instanceof $ && subj.length > 0) {
            if (subj.length === 1) {
                Subject.obj = subj;
                Subject.updateInfo();
                flags.lockMaskUpdate = false;
            } else
                throw new SSException("101", "A subject must have only one element. Multiple elements by step will be supported in future versions of Sideshow.");
        } 
        else if (subjectChanged) 
            SS.setEmptySubject();
        else
            throw new SSException("100", "Invalid subject.");
    };

    /**
    Registers a wizard

    @method registerWizard
    @param {Object} wizardConfig                          
    @return {Object}                                      The wizard instance
    @static
    **/
    SS.registerWizard = function(wizardConfig) {
        var wiz = Wizard.build(wizardConfig);
        wizards.push(wiz);
        return wiz;
    };

    /**
    Registers a wizard

    @method registerWizard
    @param {boolean} onlyNew                              Checks only recently added wizards
    @return {Array}                                       The eligible wizards list
    @static
    **/
    SS.getElegibleWizards = function(onlyNew) {
        var eligibleWizards = [];
        var somethingNew = false;
        for (var w = 0; w < wizards.length; w++) {
            var wiz = wizards[w];
            if (wiz.isEligible()) {
                if (!wiz.isAlreadyWatched()) somethingNew = true;
                eligibleWizards.push(wiz);
            }
        }

        return !onlyNew || somethingNew ? eligibleWizards : [];
    };

    /**
    Checks if there are eligible wizards, if exists, shows the wizard menu   

    @method showWizardsList
    @param {boolean} onlyNew                              Checks only recently added wizards
    @return {boolean}                                     Returns a boolean indicating whether there is some wizard available
    @static
    **/
    SS.showWizardsList = function() {
        var firstArg = arguments[0];
        var title = arguments[1];
        var onlyNew = typeof firstArg == "boolean" ? false : firstArg;
        var wizards = firstArg instanceof Array ? firstArg : this.getElegibleWizards(onlyNew);

        WizardMenu.show(wizards, title);

        return wizards.length > 0;
    };

    /**
    Shows a list with the related wizards  

    @method showRelatedWizardsList
    @param {Object} completedWizard                       The recently completed wizard
    @return {boolean}                                     Returns a boolean indicating whether there is some related wizard available
    @static
    **/
    SS.showRelatedWizardsList = function(completedWizard) {
        var relatedWizardsNames = completedWizard.relatedWizards;
        if (!relatedWizardsNames) return false;

        //Gets only related tutorials which are eligible or have a preparation function
        var relatedWizards = wizards.filter(function(w) {
            return relatedWizardsNames.indexOf(w.name) > -1 && (w.isEligible() || w.preparation);
        });
        if (relatedWizards.length == 0) return false;

        Polling.clear();
        SS.ControlVariables.clear();
        SS.showWizardsList(relatedWizards, getString(strings.relatedWizards));

        return true;
    };

    /**
    The close button for the wizard

    @class CloseButton
    @@singleton
    @extends FadableItem
    **/
    SS.CloseButton = jazz.Class().extending(FadableItem).singleton;

    /**
    Renders the close button

    @method render
    **/
    SS.CloseButton.method("render", function() {
        this.$el = $("<button>")
            .addClass("sideshow-close-button")
            .text(getString(strings.close));
        this.$el.click(function() {
            SS.close();
        });
        this.callSuper("render");
    });

    /**
    Starts Sideshow

    @method start
    @param {Object} config                                The config object for Sideshow
    **/
    SS.start = function (config) {
        config = config || {};

        if (!flags.running) {
            var onlyNew = "onlyNew" in config && !! config.onlyNew;
            var listAll = "listAll" in config && !! config.listAll;
            var wizardName = config.wizardName;

            if (listAll) SS.showWizardsList(wizards.filter(function (w) {
                return w.isEligible() || w.preparation;
            }));
            else if(wizardName){
                var wizard = wizards.filter(function (w) {
                    return w.name === wizardName;
                })[0];

                if(!wizard) throw new SSException("205", "There's no wizard with name '" + wizardName + "'.");

                wizard.prepareAndPlay();
            } 
            else SS.showWizardsList(onlyNew);

            if (SS.config.closePosition !== 'step') {
                this.CloseButton.singleInstance.render();
                this.CloseButton.singleInstance.fadeIn();
            }

            registerInnerHotkeys();
            flags.running = true;

            Polling.enqueue("check_composite_mask_screen_changes", function () {
                Mask.CompositeMask.singleInstance.pollForScreenChanges();
            });
        }
    };

