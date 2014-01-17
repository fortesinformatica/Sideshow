    /**
    Controls the polling functions needed by Sideshow

    @class Polling
    @static
    **/
    var Polling = {};

    /**
    The polling functions queue

    @@field queue
    @type Object
    @static
    **/
    Polling.queue = [];

    /**
    A flag that controls if the polling is locked

    @@field lock
    @type boolean
    @static
    **/
    Polling.lock = false;

    /**
    Pushes a polling function in the queue

    @method enqueue
    @static
    **/
    Polling.enqueue = function() {
        var firstArg = arguments[0];
        var fn;
        var name = "";

        if(typeof firstArg == "function")
            fn = firstArg;
        else{
            name = arguments[0];
            fn = arguments[1];
        } 

        if (this.getFunctionIndex(fn) < 0
            && (name === "" || this.getFunctionIndex(name) < 0)) {
            this.queue.push({ name: name, fn: fn, enabled: true });
        } else
            throw new SSException("301", "The function is already in the polling queue.");
    };

    /**
    Removes a polling function from the queue

    @method dequeue
    @static
    **/
    Polling.dequeue = function() {
        this.queue.splice(this.getFunctionIndex(arguments[0]), 1);
    };

    /**
    Enables an specific polling function

    @method enable
    @static
    **/
    Polling.enable = function(){
        this.queue[this.getFunctionIndex(arguments[0])].enabled = true;
    }

    /**
    Disables an specific polling function, but preserving it in the polling queue 

    @method disable
    @static
    **/
    Polling.disable = function(){
        this.queue[this.getFunctionIndex(arguments[0])].enabled = false;
    }

    /**
    Gets the position of a polling function in the queue based on its name or the function itself

    @method getFunctionIndex
    @static
    **/
    Polling.getFunctionIndex = function(){
        var firstArg = arguments[0];

        if(typeof firstArg == "function")
            return this.queue.map(function(p){ return p.fn; }).indexOf(firstArg);
        else if(typeof firstArg == "string")
            return this.queue.map(function(p){ return p.name; }).indexOf(firstArg);

        throw new SSException("302", "Invalid argument for getFunctionIndex method. Expected a string (the polling function name) or a function (the polling function itself).");
    }

    /**
    Unlocks the polling and starts the checking process

    @method start
    @static
    **/
    Polling.start = function() {
        this.lock = false;
        this.doPolling();
    };

    /**
    Stops the polling process

    @method stop
    @static
    **/
    Polling.stop = function() {
        this.lock = true;
    };

    /**
    Clear the polling queue

    @method clear
    @static
    **/
    Polling.clear = function() {
        var lock = this.lock;

        this.lock = true;
        this.queue = [];
        this.lock = lock;
    };

    /**
    Starts the polling process  

    @method doPolling
    @static
    **/
    Polling.doPolling = function() {
        if (!this.lock) {
            //Using timeout to avoid the queue to not complete in a cycle
            setTimeout(function() {
                for (var fn = 0; fn < Polling.queue.length; fn++) {
                    var pollingFunction = Polling.queue[fn];
                    pollingFunction.enabled && pollingFunction.fn();
                }
                Polling.doPolling();
            }, pollingDuration);
        }
    };