    /**
    Shows a warning  in a pre-defined format

    @@function showWarning
    @param {String} code                                  The warning code
    @param {String} message                               The warning message
    **/
    function showWarning(code, message) {
        console.warn("[SIDESHOW_W#" + ("00000000" + code).substr(-8) + "] " + message);
    }

    /**
    Parses a string in the format "#px" in a number

    @@function parsePxValue
    @param {String} value                                 A value with/without a px unit
    @return Number                                        The number value without unit 
    **/
    function parsePxValue(value) {
        if (value.constructor !== String) return value;
        var br = value === "" ? "0" : value;
        return +br.replace("px", "");
    }

    /**
    Gets a string from the dictionary in the current language

    @@function getString
    @param {Object} stringKeyValuePair                    A string key-value pair in dictionary
    @return String                                        The string value in the current language
    **/
    function getString(stringKeyValuePair) {
        if (!(SS.config.language in stringKeyValuePair)) {
            showWarning("2001", "String not found for the selected language, getting the first available.");
            return stringKeyValuePair[Object.keys(stringKeyValuePair)[0]];
        }

        return stringKeyValuePair[SS.config.language];
    }

    /**
    Registers hotkeys to be used when running Sideshow

    @@function registerInnerHotkeys
    **/
    function registerInnerHotkeys() {
        $document.keyup(innerHotkeysListener);
    }

    /**
    Unregisters hotkeys used when running Sideshow

    @@function Unregisters
    **/
    function unregisterInnerHotkeys() {
        $document.unbind("keyup", innerHotkeysListener);
    }

    function innerHotkeysListener(e) {
        //Esc or F1
        if (e.keyCode == 27 || e.keyCode == 112) SS.close();
    }

    /**
    Registers global hotkeys

    @@function registerGlobalHotkeys
    **/
    function registerGlobalHotkeys() {
        $document.keyup(function(e) {
            //F2
            if (e.keyCode == 113) {
                if (e.shiftKey) SS.start({
                    listAll: true
                });
                else SS.start();
            }
        });
    }

    /**
    Removes nodes created by Sideshow (except mask, which remains due to performance reasons when recalling Sideshow)

    @@function removeDOMGarbage
    **/
    function removeDOMGarbage() {
        $("[class*=\"sideshow\"]").not(".sideshow-mask-part, .sideshow-mask-corner-part, .sideshow-subject-mask").remove();
    }
