    /**
    Stores the variables used in step evaluators 

    @class ControlVariables
    @static
    **/
    SS.ControlVariables = {};

    /**
    Sets a variable value

    @method set
    @param {String} name                                  The variable name
    @param {String} value                                 The variable value
    @return {String}                                      A formatted key=value pair representing the defined variable 
    **/
    SS.ControlVariables.set = function(name, value) {
        var variable = {};
        if (this.isDefined(name)) {
            variable = this.getNameValuePair(name);
        } else controlVariables.push(variable);

        variable.name = name;
        variable.value = value;
        return name + "=" + value;
    };

    /**
    Sets a variable if not defined yet

    @method setIfUndefined
    @param {String} name                                  The variable name
    @param {String} value                                 The variable value
    @return {String}                                      A formatted key=value pair representing the defined variable 
    **/
    SS.ControlVariables.setIfUndefined = function(name, value) {
        if (!this.isDefined(name)) return this.set(name, value);
    };

    /**
    Checks if some variable is already defined

    @method isDefined
    @param {String} name                                  The variable name
    @return {boolean}                                     A boolean indicating if the variable is already defined
    **/
    SS.ControlVariables.isDefined = function(name) {
        return this.getNameValuePair(name) !== undefined;
    };

    /**
    Gets a variable value

    @method get
    @param {String} name                                  The variable name
    @return {any}                                         The variable value
    **/
    SS.ControlVariables.get = function(name) {
        var pair = this.getNameValuePair(name);
        return pair ? pair.value : undefined;
    };

    /**
    Gets a pair with name and value 

    @method getNameValuePair
    @param {String} name                                  The variable name
    @return {Object}                                      A pair with the variable name and value
    **/
    SS.ControlVariables.getNameValuePair = function(name) {
        for (var i = 0; i < controlVariables.length; i++) {
            var variable = controlVariables[i];
            if (variable.name === name) return variable;
        }
    };

    /**
    Remove some variable from the control variables collection

    @method remove
    @param {String} name                                  The variable name
    @return {Object}                                      A pair with the removed variable name and value
    **/
    SS.ControlVariables.remove = function(name) {
        return controlVariables.splice(controlVariables.indexOf(this.getNameValuePair(name)), 1);
    };

    /**
    Clear the control variables collection 

    @method clear
    **/
    SS.ControlVariables.clear = function() {
        controlVariables = [];
    };
