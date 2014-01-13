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
    @param {Function} fn                                  The polling function to enqueue
    @static
    **/
    Polling.enqueue = function(fn) {
        if (this.queue.indexOf(fn) < 0) {
            this.queue.push(fn);
        } else
            throw new SSException("301", "The function is already in the polling queue.");
    };

    /**
    Removes a polling function from the queue

    @method dequeue
    @param {Function} fn                                  The polling function to dequeue
    @static
    **/
    Polling.dequeue = function(fn) {
        this.queue.splice(this.queue.indexOf(fn), 1);
    };

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
                    pollingFunction();
                }
                Polling.doPolling();
            }, pollingDuration);
        }
    };