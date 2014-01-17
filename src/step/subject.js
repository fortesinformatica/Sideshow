    /**
    The current subject (the object being shown by the current wizard)

    @class Subject
    @static
    **/
    var Subject = {};

    /**
    The current subject jQuery wrapped DOM element 

    @@field obj
    @static
    @type Object
    **/
    Subject.obj = null;

    /**
    The current subject dimension information

    @@field position
    @static
    @type Object
    **/
    Subject.dimension = {};

    /**
    The current subject positioning information

    @@field position
    @static
    @type Object
    **/
    Subject.position = {};

    /**
    The current subject border radius information

    @@field borderRadius
    @static
    @type Object
    **/
    Subject.borderRadius = {};

    /**
    Checks if the object has changed since the last checking

    @method hasChanged
    @return boolean
    **/
    Subject.hasChanged = function() {
        if (!this.obj) return false;

        return (this.obj.offset().left - $window.scrollLeft() !== this.position.x) ||
            (this.obj.offset().top - $window.scrollTop() !== this.position.y) ||
            (this.obj.outerWidth() !== this.dimension.width) ||
            (this.obj.outerHeight() !== this.dimension.height) ||
            (parsePxValue(this.obj.css("border-top-left-radius")) !== this.borderRadius.leftTop) ||
            (parsePxValue(this.obj.css("border-top-right-radius")) !== this.borderRadius.rightTop) ||
            (parsePxValue(this.obj.css("border-bottom-left-radius")) !== this.borderRadius.leftBottom) ||
            (parsePxValue(this.obj.css("border-bottom-right-radius")) !== this.borderRadius.rightBottom) ||
            Screen.hasChanged();
    };

    /**
    Updates the information about the suject

    @method updateInfo
    @param {Object} config                                Dimension, positioning and border radius information
    **/
    Subject.updateInfo = function(config) {
        if (config === undefined) {
            this.position.x = this.obj.offset().left - $window.scrollLeft();
            this.position.y = this.obj.offset().top - $window.scrollTop();
            this.dimension.width = this.obj.outerWidth();
            this.dimension.height = this.obj.outerHeight();
            this.borderRadius.leftTop = parsePxValue(this.obj.css("border-top-left-radius"));
            this.borderRadius.rightTop = parsePxValue(this.obj.css("border-top-right-radius"));
            this.borderRadius.leftBottom = parsePxValue(this.obj.css("border-bottom-left-radius"));
            this.borderRadius.rightBottom = parsePxValue(this.obj.css("border-bottom-right-radius"));
        } else {
            this.position.x = config.position.x;
            this.position.y = config.position.y;
            this.dimension.width = config.dimension.width;
            this.dimension.height = config.dimension.height;
            this.borderRadius.leftTop = config.borderRadius.leftTop;
            this.borderRadius.rightTop = config.borderRadius.rightTop;
            this.borderRadius.leftBottom = config.borderRadius.leftBottom;
            this.borderRadius.rightBottom = config.borderRadius.rightBottom;
        }

        Screen.updateInfo();
    };  

    Subject.isSubjectVisible = function(position, dimension){
        if((position.y + dimension.height) > $window.height() || position.y < 0){
            return false;
        }
        return true;
    };