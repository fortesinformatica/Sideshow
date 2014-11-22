(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(global, $, jazz, markdown) {
    //jQuery is needed
    if ($ === undefined) throw new SSException("2", "jQuery is required for Sideshow to work.");

    //Jazz is needed
    if (jazz === undefined) throw new SSException("3", "Jazz is required for Sideshow to work.");

    //Pagedown (the Markdown parser used by Sideshow) is needed
    if (markdown === undefined) throw new SSException("4", "Pagedown (the Markdown parser used by Sideshow) is required for Sideshow to work.");


    //= require general/variables
    //= require general/exception
    //= require general/utility_functions
    //= require general/dictionary
    //= require general/config
    //= require wizard/wizard_control_variables
    //= require interface_itens/visual_item
    //= require interface_itens/hidable_item
    //= require interface_itens/fadable_item
    //= require wizard/wizard
    //= require step/step_details_panel
    //= require step/arrows
    //= require step/arrow
    //= require step/step_description
    //= require step/step_description_next_button
    //= require general/screen
    //= require step/subject
    //= require mask/mask
    //= require mask/subject_mask
    //= require mask/composite_mask
    //= require mask/composite_mask_part
    //= require mask/composite_mask_corner_part
    //= require general/polling
    //= require wizard/wizard_menu
    //= require general/global_object

    //Tries to register the Global Access Point
    if (global[globalObjectName] === undefined) {
        global[globalObjectName] = SS;
    } else
        throw new SSException("1", "The global access point \"Sideshow\" is already being used.");
})(window, jQuery, Jazz, Markdown);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxGb3J0ZXNcXFByb2pldG9zXFxTaWRlc2hvd05ld1xcbm9kZV9tb2R1bGVzXFxndWxwLWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiYzovRm9ydGVzL1Byb2pldG9zL1NpZGVzaG93TmV3L3NyYy9mYWtlXzNjNWYzNzRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oZ2xvYmFsLCAkLCBqYXp6LCBtYXJrZG93bikge1xuICAgIC8valF1ZXJ5IGlzIG5lZWRlZFxuICAgIGlmICgkID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBTU0V4Y2VwdGlvbihcIjJcIiwgXCJqUXVlcnkgaXMgcmVxdWlyZWQgZm9yIFNpZGVzaG93IHRvIHdvcmsuXCIpO1xuXG4gICAgLy9KYXp6IGlzIG5lZWRlZFxuICAgIGlmIChqYXp6ID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBTU0V4Y2VwdGlvbihcIjNcIiwgXCJKYXp6IGlzIHJlcXVpcmVkIGZvciBTaWRlc2hvdyB0byB3b3JrLlwiKTtcblxuICAgIC8vUGFnZWRvd24gKHRoZSBNYXJrZG93biBwYXJzZXIgdXNlZCBieSBTaWRlc2hvdykgaXMgbmVlZGVkXG4gICAgaWYgKG1hcmtkb3duID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBTU0V4Y2VwdGlvbihcIjRcIiwgXCJQYWdlZG93biAodGhlIE1hcmtkb3duIHBhcnNlciB1c2VkIGJ5IFNpZGVzaG93KSBpcyByZXF1aXJlZCBmb3IgU2lkZXNob3cgdG8gd29yay5cIik7XG5cblxuICAgIC8vPSByZXF1aXJlIGdlbmVyYWwvdmFyaWFibGVzXG4gICAgLy89IHJlcXVpcmUgZ2VuZXJhbC9leGNlcHRpb25cbiAgICAvLz0gcmVxdWlyZSBnZW5lcmFsL3V0aWxpdHlfZnVuY3Rpb25zXG4gICAgLy89IHJlcXVpcmUgZ2VuZXJhbC9kaWN0aW9uYXJ5XG4gICAgLy89IHJlcXVpcmUgZ2VuZXJhbC9jb25maWdcbiAgICAvLz0gcmVxdWlyZSB3aXphcmQvd2l6YXJkX2NvbnRyb2xfdmFyaWFibGVzXG4gICAgLy89IHJlcXVpcmUgaW50ZXJmYWNlX2l0ZW5zL3Zpc3VhbF9pdGVtXG4gICAgLy89IHJlcXVpcmUgaW50ZXJmYWNlX2l0ZW5zL2hpZGFibGVfaXRlbVxuICAgIC8vPSByZXF1aXJlIGludGVyZmFjZV9pdGVucy9mYWRhYmxlX2l0ZW1cbiAgICAvLz0gcmVxdWlyZSB3aXphcmQvd2l6YXJkXG4gICAgLy89IHJlcXVpcmUgc3RlcC9zdGVwX2RldGFpbHNfcGFuZWxcbiAgICAvLz0gcmVxdWlyZSBzdGVwL2Fycm93c1xuICAgIC8vPSByZXF1aXJlIHN0ZXAvYXJyb3dcbiAgICAvLz0gcmVxdWlyZSBzdGVwL3N0ZXBfZGVzY3JpcHRpb25cbiAgICAvLz0gcmVxdWlyZSBzdGVwL3N0ZXBfZGVzY3JpcHRpb25fbmV4dF9idXR0b25cbiAgICAvLz0gcmVxdWlyZSBnZW5lcmFsL3NjcmVlblxuICAgIC8vPSByZXF1aXJlIHN0ZXAvc3ViamVjdFxuICAgIC8vPSByZXF1aXJlIG1hc2svbWFza1xuICAgIC8vPSByZXF1aXJlIG1hc2svc3ViamVjdF9tYXNrXG4gICAgLy89IHJlcXVpcmUgbWFzay9jb21wb3NpdGVfbWFza1xuICAgIC8vPSByZXF1aXJlIG1hc2svY29tcG9zaXRlX21hc2tfcGFydFxuICAgIC8vPSByZXF1aXJlIG1hc2svY29tcG9zaXRlX21hc2tfY29ybmVyX3BhcnRcbiAgICAvLz0gcmVxdWlyZSBnZW5lcmFsL3BvbGxpbmdcbiAgICAvLz0gcmVxdWlyZSB3aXphcmQvd2l6YXJkX21lbnVcbiAgICAvLz0gcmVxdWlyZSBnZW5lcmFsL2dsb2JhbF9vYmplY3RcblxuICAgIC8vVHJpZXMgdG8gcmVnaXN0ZXIgdGhlIEdsb2JhbCBBY2Nlc3MgUG9pbnRcbiAgICBpZiAoZ2xvYmFsW2dsb2JhbE9iamVjdE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZ2xvYmFsW2dsb2JhbE9iamVjdE5hbWVdID0gU1M7XG4gICAgfSBlbHNlXG4gICAgICAgIHRocm93IG5ldyBTU0V4Y2VwdGlvbihcIjFcIiwgXCJUaGUgZ2xvYmFsIGFjY2VzcyBwb2ludCBcXFwiU2lkZXNob3dcXFwiIGlzIGFscmVhZHkgYmVpbmcgdXNlZC5cIik7XG59KSh3aW5kb3csIGpRdWVyeSwgSmF6eiwgTWFya2Rvd24pO1xuIl19
