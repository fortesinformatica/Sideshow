//Just preventing the worst... =D 
//http://stackoverflow.com/questions/7365172/semicolon-before-self-invoking-function
;
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
