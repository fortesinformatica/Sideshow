    /**
    Represents a tutorial

    @class Wizard
    @@initializer
    @param {Object} wizardConfig                          The wizard configuration object                        
    **/
    var Wizard = jazz.Class(function(wizardConfig) {
        this.name = wizardConfig.name;
        this.title = wizardConfig.title;
        this.description = wizardConfig.description;
        this.estimatedTime = wizardConfig.estimatedTime;
        this.affects = wizardConfig.affects;
        this.preparation = wizardConfig.preparation;
        this.listeners = wizardConfig.listeners;
        this.showStepPosition = wizardConfig.showStepPosition;
        this.enableNextButtonTitle = wizardConfig.enableNextButtonTitle;
        this.relatedWizards = wizardConfig.relatedWizards;
    });

    /**
    A function to prepare the environment for running a wizard (e.g. redirecting to some screen)

    @@field preparation
    @type Function
    **/
    Wizard.field("preparation");

    /**
    An object with listeners to this wizard (e.g. beforeWizardStarts, afterWizardEnds)

    @@field listeners
    @type Object
    **/
    Wizard.field("listeners");

    /**
    A configuration flag that defines if the step position (e.g. 2/10, 3/15, 12/12) will be shown

    @@field showStepPosition
    @type boolean
    **/
    Wizard.field("showStepPosition");

    /**
    An array with related wizards names. These wizards are listed after the ending of the current wizard.

    @@field relatedWizards
    @type Array
    **/
    Wizard.field("relatedWizards");

    /**
    The wizard unique name (used internally as an identifier)

    @@field name
    @type String
    **/
    Wizard.field("name");

    /**
    The wizard title (will be shown in the list of available wizards)

    @@field title
    @type String
    **/
    Wizard.field("title");

    /**
    The wizard description (will be shown in the list of available wizards)

    @@field description
    @type String
    **/
    Wizard.field("description");

    /**
    The wizard estimated completion time (will be shown in the list of available wizards)

    @@field estimatedTime
    @type String
    **/
    Wizard.field("estimatedTime");

    /**
    A collection of rules to infer whether a wizard should be available in a specific screen

    @@field affects
    @type Array
    **/
    Wizard.field("affects");

    /**
    The sequence of steps for this wizard

    @@field storyline
    @private
    @type Object
    **/
    Wizard.field("_storyline");

    /**
    Points to the current step object in a playing wizard

    @@field currentStep
    @type Object
    **/
    Wizard.field("currentStep");

    /**
    Sets the storyline for the wizard

    @method storyLine
    **/
    Wizard.method("storyLine", function(storyline) {
        this._storyline = storyline;
    });

    /**
    Runs the wizard

    @method play
    **/
    Wizard.method("play", function() {
        var wiz = this;

        wiz._currentPath = null;

        Polling.enqueue("check_composite_mask_subject_changes", function() {
            Mask.CompositeMask.singleInstance.pollForSubjectChanges();
        });

        Polling.enqueue("check_arrow_changes", function() {
            Arrows.pollForArrowsChanges(true);
        });

        //Checks if the wizard has a storyline
        if (!this._storyline) throw new SSException("201", "A wizard needs to have a storyline.");
        var steps = this._getSteps();

        //Checks if the storyline has at least one step
        if (steps.length === 0) throw new SSException("202", "A storyline must have at least one step.");

        DetailsPanel.singleInstance.render();

        StepDescription.singleInstance.render();

        var listeners = this.listeners;
        if (listeners && listeners.beforeWizardStarts) listeners.beforeWizardStarts();

        flags.changingStep = true;
        this.showStep(steps[0], function() {
            //Releases the polling for checking any changes in the current subject
            //flags.lockMaskUpdate = false;

            //Register the function that checks the completing of a step in the polling queue
            Polling.enqueue("check_completed_step", function() {
                wiz.pollForCheckCompletedStep();
            });
        });

        Mask.CompositeMask.singleInstance.fadeIn();
    });

    /**
    Shows a specific step

    @method showStep
    @param {Object} step                                  The step to be shown
    @param {Function} callback                            A callback function to be called
    **/
    Wizard.method("showStep", function(step, callback) {
        var wizard = this;
        flags.skippingStep = false;

        Arrows.clear();

        if (this.currentStep && this.currentStep.listeners && this.currentStep.listeners.afterStep)
            this.currentStep.listeners.afterStep();

        function skipStep(wiz) {
            flags.skippingStep = true;
            wizard.next();
        }

        //The shown step is, of course, the current
        this.currentStep = step;

        //If the step has a skipIf evaluator and it evaluates to true, we'll skip to the next step!
        if (step.skipIf && step.skipIf())
            skipStep(this);
        
        if(!flags.skippingStep){
          if (step && step.listeners && step.listeners.beforeStep)
              step.listeners.beforeStep();

          if (flags.changingStep) {
              //Sets the current subject and updates its dimension and position
              if (step.subject)
                  SS.setSubject(step.subject);
              else
                  SS.setEmptySubject();
              //Updates the mask
              Mask.CompositeMask.singleInstance.update(Subject.position, Subject.dimension, Subject.borderRadius);

              var sm = Mask.SubjectMask.singleInstance;
              sm.fadeOut(function() {
                  if (step.lockSubject) sm.show(true);
              });
              //The details panel (that wraps the step description and arrow) is shown
              DetailsPanel.singleInstance.show();
              //Repositionate the details panel depending on the remaining space in the screen
              DetailsPanel.singleInstance.positionate();
              //Sets the description properties (text, title and step position)
              var description = StepDescription.singleInstance;
              var text = step.text;
              text = text instanceof Function ? SS.heredoc(text) : text;
              if(step.format == "html") {
                  description.setHTML(text);
              } else if (step.format == "markdown") {
                  description.setHTML(new markdown.Converter().makeHtml(text));
              } else {
                  description.setText(text);
              }

              description.setTitle(step.title);

              description.setStepPosition((this.getStepPosition() + 1) + "/" + this._getSteps().length);                

              var hasPaths = wizard._storyline.paths && wizard._storyline.paths.length > 0;

              //If this step doesn't have its own passing conditions/evaluators, or the flag "showNextButton" is true, then, the button is visible
              if (step.showNextButton || step.autoContinue === false || !(step.completingConditions && step.completingConditions.length > 0)) {
                  var nextStep = this._getSteps()[this.getStepPosition() + 1];
                  if (nextStep) {
                      description.nextButton.setText(getString(strings.next) + (hasPaths || wizard.enableNextButtonTitle === false ? "" : ": " + this._getSteps()[this.getStepPosition() + 1].title));
                  } else {
                      description.nextButton.setText(getString(strings.finishWizard));
                  }
                  description.nextButton.show();

                  if (step.autoContinue === false) description.nextButton.disable();
              } else {
                  description.nextButton.hide();
              }

              if (step.targets && step.targets.length > 0) {
                  Arrows.setTargets(step.targets);
                  Arrows.render(step.arrowPosition);
                  Arrows.positionate();
                  Arrows.fadeIn();
              }

              //Step Description is shown, but is transparent yet (since we need to know its dimension to positionate it properly)
              description.show(true);
              if(!Mask.CompositeMask.singleInstance.scrollIfNecessary(Subject.position, Subject.dimension)){
                  description.positionate();
                  //Do a simple fade in for the description box
                  description.fadeIn();
              }
              
                //If a callback is passed, call it    
              if (callback) callback();
              flags.changingStep = false;
          }
        }
    });

    /**
    Shows the next step of the wizard

    @method next 
    @param {Function} callback                            A callback function to be called
    **/
    Wizard.method("next", function(callback, nextStep) {
        if (!flags.changingStep || flags.skippingStep) {
            flags.changingStep = true;
            var currentStep = this.currentStep;
            nextStep = nextStep || this._getSteps()[this.getStepPosition(this.currentStep) + 1];
            var self = this;

            this.hideStep(function() {
                if (nextStep) self.showStep(nextStep, function() {
                    if (callback) callback();
                });
                else {
                    if (currentStep && currentStep.listeners && currentStep.listeners.afterStep)
                        currentStep.listeners.afterStep();

                    var completedWizard = currentWizard;
                    currentWizard = null;
                    var listeners = self.listeners;
                    if (listeners && listeners.afterWizardEnds) listeners.afterWizardEnds();

                    if (!SS.showRelatedWizardsList(completedWizard)) SS.close();
                }
            });
        }
    });

    /**
    Hides the step

    @method hideStep
    @param {Function} callback                            A callback function to be called in the ending of the hiding process
    **/
    Wizard.method("hideStep", function(callback) {
        StepDescription.singleInstance.fadeOut(function() {
            DetailsPanel.singleInstance.hide();
        });
        Arrows.fadeOut();
        Mask.SubjectMask.singleInstance.update(Subject.position, Subject.dimension, Subject.borderRadius);
        Mask.SubjectMask.singleInstance.fadeIn(callback);
    });

    /**
    Returns the position of the step passed as argument or (by default) the current step

    @method getStepPosition
    @param {Object} step                                  The step object to get position
    **/
    Wizard.method("getStepPosition", function(step) {
        return this._getSteps().indexOf(step || this.currentStep);
    });

    /**
    Checks if a wizard should be shown in the current context (running each evaluator defined for this wizard)

    @method isEligible
    @return {boolean}                                     A boolean indicating if this wizard should be available in the current context
    **/
    Wizard.method("isEligible", function() {
        var l = global.location;

        function isEqual(a, b, caseSensitive) {
            return (caseSensitive) ? a === b : a.toLowerCase() === b.toLowerCase();
        }

        for (var c = 0; c < this.affects.length; c++) {
            var condition = this.affects[c];
            if (condition instanceof Function) {
                if (condition()) return true;
            } else if (condition instanceof Object) {
                if ("route" in condition) {
                    var route = l.pathname + l.search + l.hash;
                    if (isEqual(route, condition.route, condition.caseSensitive)) return true;
                }

                if ("hash" in condition) {
                    if (isEqual(location.hash, condition.hash, condition.caseSensitive)) return true;
                }

                if ("url" in condition) {
                    if (isEqual(location.href, condition.url, condition.caseSensitive)) return true;
                }
            }
        }
        return false;
    });

    /**
    Checks if the current user already watched this wizard

    @method isAlreadyWatched
    @return {boolean}                                     A boolean indicating if the user watched this wizard
    @@todo Implement this method...
    **/
    Wizard.method("isAlreadyWatched", function() {
        //ToDo
        return false;
    });

    Wizard.method("_getSteps", function() {
        return (this._currentPath &&  this._currentPath.steps) || this._storyline.steps;
    });

    /**
    A Polling function to check if the current step is completed

    @method pollForCheckCompletedStep
    **/
    Wizard.method("pollForCheckCompletedStep", function() {
        var conditions = this.currentStep.completingConditions;
        if (conditions && conditions.length > 0 && !flags.skippingStep) {
            var completed = true;
            for (var fn = 0; fn < conditions.length; fn++) {
                var completingCondition = conditions[fn];
                if (!completingCondition()) completed = false;
            }

            if (completed) {
                if (this.currentStep.autoContinue === false) StepDescription.singleInstance.nextButton.enable();
                else currentWizard.next();
            }
        }
    });


    Wizard.method("prepareAndPlay", function(){
        currentWizard = this;

        if (!this.isEligible()) {
            if (this.preparation)
                this.preparation(function() {
                    currentWizard.play();
                });
            else
                throw new SSException("203", "This wizard is not eligible neither has a preparation function.");
        } else this.play();
    });
