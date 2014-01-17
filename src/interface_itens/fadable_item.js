    /**
    A visual item which holds fading in and out capabilities

    @class FadableItem
    @@abstract
    @extends HidableItem
    **/
    var FadableItem = jazz.Class().extending(HidableItem).abstract;

    /**
    Does a fade in transition for the visual item

    @method fadeIn
    **/
    FadableItem.method("fadeIn", function(callback, linearTimingFunction) {
        var item = this;
        item.status = AnimationStatus.FADING_IN;

        if (!item.$el) this.render();
        if (linearTimingFunction) item.$el.css("animation-timing-function", "linear");
        item.$el.removeClass("sideshow-hidden");

        //Needed hack to get CSS transition to work properly
        setTimeout(function() {
            item.$el.removeClass("sideshow-invisible");

            setTimeout(function() {
                item.status = AnimationStatus.VISIBLE;
                if (linearTimingFunction) item.$el.css("animation-timing-function", "ease");
                if (callback) callback();
            }, longAnimationDuration);
        }, 20); //<-- Yeap, I'm really scheduling a timeout for 20 milliseconds... this is a dirty trick =)
    });

    /**
    Does a fade out transition for the visual item

    @method fadeOut
    **/
    FadableItem.method("fadeOut", function(callback, linearTimingFunction) {
        var item = this;
        if (item.status != AnimationStatus.NOT_RENDERED) {
            item.status = AnimationStatus.FADING_OUT;

            if (linearTimingFunction) item.$el.css("animation-timing-function", "linear");
            item.$el.addClass("sideshow-invisible");

            setTimeout(function() {
                item.$el.addClass("sideshow-hidden");
                item.status = AnimationStatus.NOT_DISPLAYED;
                if (linearTimingFunction) item.$el.css("animation-timing-function", "ease");
                if (callback) callback();
            }, longAnimationDuration);
        }
    });
