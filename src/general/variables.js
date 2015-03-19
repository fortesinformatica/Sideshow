    var globalObjectName = "Sideshow",
        $window,
        $body,
        $document,
        pollingDuration = 150,
        longAnimationDuration = 600,

        /** 
        The main class for Sideshow

        @class SS 
        @static
        **/
        SS = {
            /**
            The current Sideshow version

            @property VERSION
            @type String
            **/
            get VERSION() {
                return "0.4.3";
            }
        },

        controlVariables = [],
        flags = {
            lockMaskUpdate: false,
            changingStep: false,
            skippingStep: false,
            running: false
        },
        wizards = [],
        currentWizard,

        /**
        Possible statuses for an animation

        @@enum AnimationStatus
        **/
        AnimationStatus = jazz.Enum("VISIBLE", "FADING_IN", "FADING_OUT", "NOT_DISPLAYED", "NOT_RENDERED", "TRANSPARENT");

