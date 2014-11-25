;(function(global, $, jazz, markdown){
  (function(name, module){
    var ss = module();
   
    if (typeof define === 'function' && define.amd){ 
      define(module);
    } else { 
      global[name] = ss;
    }
  })('sideshow', function(){
      //jQuery is needed
      if ($ === undefined) throw new SSException("2", "jQuery is required for Sideshow to work.");

      //Jazz is needed
      if (jazz === undefined) throw new SSException("3", "Jazz is required for Sideshow to work.");

      //Pagedown (the Markdown parser used by Sideshow) is needed
      if (markdown === undefined) throw new SSException("4", "Pagedown (the Markdown parser used by Sideshow) is required for Sideshow to work.");

      //=include general/variables.js
      //=include general/exception.js
      //=include general/utility_functions.js
      //=include general/dictionary.js
      //=include general/config.js
      //=include wizard/wizard_control_variables.js
      //=include interface_itens/visual_item.js
      //=include interface_itens/hidable_item.js
      //=include interface_itens/fadable_item.js
      //=include wizard/wizard.js
      //=include step/step_details_panel.js
      //=include step/arrows.js
      //=include step/arrow.js
      //=include step/step_description.js
      //=include step/step_description_next_button.js
      //=include general/screen.js
      //=include step/subject.js
      //=include mask/mask.js
      //=include mask/subject_mask.js
      //=include mask/composite_mask.js
      //=include mask/composite_mask_part.js
      //=include mask/composite_mask_corner_part.js
      //=include general/polling.js
      //=include wizard/wizard_menu.js
      //=include general/global_object.js

      //Tries to register the Global Access Point
      if (global[globalObjectName] === undefined) {
        global[globalObjectName] = SS;
      } else
        throw new SSException("1", "The global access point \"Sideshow\" is already being used.");
  });
})(this, jQuery, Jazz, Markdown);
