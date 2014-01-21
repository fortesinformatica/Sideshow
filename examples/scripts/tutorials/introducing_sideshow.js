//A Sideshow Tutorial Example
//This tutorial introduces the Sideshow basics to the newcomer

Sideshow.registerWizard({
    name: "introducing_sideshow",
    title: "Introducing Sideshow",
    description: "Introducing the main features and concepts of Sideshow. ",
    estimatedTime: "10 Minutes",
    affects: [
		function(){
			//Here we could do any checking to infer if this tutorial is eligible the current screen/context. 
			//After this checking, just return a boolean indicating if this tutorial will be available. 
			//As a simple example we're returning a true, so this tutorial would be available in any context
			return true;
		}
    ]
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "More than a tour... we can do much more.",
		    text: "Sideshow can much more than just walk users through your site/web application. Sideshow can mediate the interaction between users and your UI. Go ahead and let's see some powerful features."
		},
		{
		    title: "The Subject",
		    text: "In each step of a tutorial/wizard/tour/help (you can call it the way you want =D ) you're talking about something. Sometimes you're just explaining a concept, but at the most part of time, you're explaining some visual part of a screen or a page (e.g. a form, button, div, grid and so forth). We call these visual parts subjects. A subject of a step is just an element of your page you're aiming to stand out from the rest (when user is seeing that especific step) to comment/explain something about it."
		},
		{
		    title: "Masking a Subject",
		    text: "An example could be this text: in this step, this text is the subject. As you can see, we're surrounding it with a dark mask. This make you look at the subject with no doubt where it's located. If you're curious how we make it work: for the moment, you just need to know we're not using `z-index` to pull the subject above the mask. Some tour libraries do this, we see a plenty of drawbacks in this approach. \n\n When writing a tutorial, each subject is represented by a jQuery-like/querySelectorAll-like/CSS-like selector. For this step, for instance, the subject is a `div`, and its selector is `#introducing_sideshow`, but could be any other valid selector returning the same element.\n\nP.S: for now, Sideshow only supports single subjects per step. If you define a subject selector which returns more than one element, Sideshow will throw an exception. Multiple steps will (propably) be available in future versions of Sideshow.",
		    subject: "#introducing_sideshow",
		    format: "markdown"
		},
		{
		    title: "You Won't lose your Rounded Corners",
		    text: "We would never leave you without your rounded corners! =)\n\nJust see this button again, look at the corners, they're pretty masked pal!\n\nP.S: Don't blame me if the button click is not doing anything. This behavior is correct, you can't open two instances of Sideshow simultaneously. ;-)",
		    subject: "#run_example",
		    format: "markdown"
		},
		{
		    title: "Preventing Undesirable Clicks",
		    text: "In the previous step, probably you tried to click on that button. The user shouln't be able to click in the button in that moment. Sideshow can deal with this situation easily, there's a step option `lockSubject` which preserves the mask appearance but prevents the user to interact with the subject with the mouse.\n\n**Just try to click in the button.**",
		    subject: "#run_example",
		    lockSubject: true,
		    format: "markdown"
		},
		{
		    title: "Targets - Pointing to items in the subject area",
		    text: "As we've seen previously, by masking a subject, we highlight a specific zone of a page which we want to explain.\n\nAlthough this is enough for a great deal of cases, sometimes we need to \"point\" to one or more itens inside the subject area. Sideshow can do this easily for you, as easy as you define subjects. Let's see an example in the next step.",
		    format: "markdown"
		},
		{
		    title: "Targets - A simple example",
		    text: "To point to the last `em` tag of this description, just declare a step option called `targets` setting its value with a selector for this tag. >>> `targets: \"#introducing_sideshow em:last-of-type\"`.\n\nAs you can see, it's just a CSS selector, no complications here!",
		    subject: "#introducing_sideshow",
		    targets: "#introducing_sideshow em:last-of-type",
		    format: "markdown"
		},
		{
		    title: "Targets - Multiple targets",
		    text: "Here you can see an example of multiple targets. The selector used for these targets is `#survey input`.",
		    subject: "#survey",
		    targets: "#survey input",
		    format: "markdown"
		},
		{
		    title: "Targets - Multiple targets",
		    text: "Another example of multiple targets. The selector used for these targets is `#introducing_sideshow em:last-of-type, #header_content > img`.",
		    subject: "header",
		    targets: "#introducing_sideshow em:last-of-type, #header_content > img",
		    format: "markdown"
		},
		{
		    title: "We can scroll too!",
		    text: "When a subject isn't fully visible, Sideshow automatically scrolls the page 'til the subject is squared.",
		    subject: "#godfather1"
		},
		{
		    title: "We're back to the top!",
		    text: "Well, we're on top again. Now, let's learn an important concept of Sideshow, the step completing conditions.",
		    subject: "#header_content > img"
		},
		{
			title: "Step Completing Conditions",
		    text: function(){/*
There are some cases where you just don't want the user to be able to continue the tutorial by clicking in the next button. 

*	You want the user to perform some action, or...
*	You're waiting for a server response, or...
*	You're expecting your application to be in some specific state before allowing user to continue.

Sideshow provides a way for detecting if your tutorial is ready to proceed to the next step. This feature is called **completing conditions**, you just need to define a function (an evaluator), which will perform some checking and return a boolean. This function is evaluated continuously and shouldn't change the state of your application. When this function return a true value, the user will be allowed to continue. 
			*/},//<<This block-comment-inside-function syntax is a trick to allow some sort of HEREDOC syntax, this can't be used in minified tutorial files, these comments are simply stripped out.
		    format: "markdown"
		},
		{
			title: "An Example of Completing Condition",
			text: "Ok, look at the Next button, it's disabled, for now you're not allowed to continue. As an example, the **completing condition** for this step is that user (obviously you =D) has to drag the Dr. Brown photo and drop it over the red square. Please, perform this action in order to activate the next button.",
		    format: "markdown",
		    listeners: {
		    	beforeStep: function(){
		    		$("#red_square").fadeIn(function(){
		    			$('#red_square').on('dragover', function (e) {
						    var event = e.originalEvent;
						    if (event.preventDefault) {
						        event.preventDefault();
						    }
						    event.dataTransfer.dropEffect = 'copy';
						    return false;
						});
						 
						$('#red_square').on('drop', function (e) {
						    var event = e.originalEvent;
						    if (event.stopPropagation) {
						        event.stopPropagation();
						    }
						   	$('#dr_brown').appendTo(this);

						   	//Let's hide the target arrows (in future versions of Sideshow we'll have a more elegant way to do this inside a listener =D)
						   	$(".sideshow-subject-arrow").fadeOut();
						    
						    return false;
						});

		    		});
		    		
		    	}
		    },
		    targets: "#dr_brown, #red_square",
		    subject: "#bttf",
		    autoContinue: false,
		    completingConditions: [
		    	function(){
		    		return $("#red_square #dr_brown").length > 0; 
		    	}
		    ]
		},
		{
			title: "Auto Continue",
			text: "If you want Sideshow proceed automatically to the next step, you can use set **autoContinue** flag to true. This way, when your completing conditions are satisfied, Sideshow will continue to the next step.\n\nDrag the Dr. Brown photo again to its original place to continue.",
		    format: "markdown",
		    listeners: {
		    	beforeStep: function(){
	    			$('#bttf figure').on('dragover', function (e) {
					    var event = e.originalEvent;
					    if (event.preventDefault) {
					        event.preventDefault();
					    }
					    event.dataTransfer.dropEffect = 'copy';
					    return false;
					});
					 
					$('#bttf figure').on('drop', function (e) {
					    var event = e.originalEvent;
					    if (event.stopPropagation) {
					        event.stopPropagation();
					    }
					   	$('#dr_brown').appendTo(this);

					   	//Let's hide the target arrows (in future versions of Sideshow we'll have a more elegant way to do this inside a listener =D)
					   	$(".sideshow-subject-arrow").fadeOut();
					    
					    return false;
					});
		    	},
		    	afterStep: function(){
		    		$("#red_square").fadeOut();
		    	}
		    },
		    targets: "#bttf figure, #dr_brown",
		    subject: "#bttf",
		    autoContinue: true,
		    completingConditions: [
		    	function(){
		    		return $("#bttf figure #dr_brown").length > 0; 
		    	}
		    ]
		},
		{
			title: "Rich Formatting with Markdown",
			text: function(){/*
Most of times you we'll need just plain text for your step descriptions, but you may also need to add some kind of formatting. For this purpose, Sideshow accepts Markdown text. You just need to set the `format` step property to `"markdown"`. 
This way you could use:

*	Unordered lists
*	Like this one.
*	Or maybe...

----------------------

1. 	This is
2. 	An ordered list
3. 	It's simple to use

**A bold text**

*An italic text*

`Source code example`

![Fortes Informática Logo](examples/images/fortes-logo.png)
			*/},
			format: "markdown"
		},
		{
			title: "Events",
			text: "You can listen to events like `beforeStep`, `afterStep`, `beforeWizardStarts`, `afterWizardEnds` and do whatever you want. Like preparing the environment for the next step.",
			format: "markdown"
		},
		{
			title: "Moving to other step",
			text: "You can move to other step by its position (which is 1-based) or by its name property, which is an unique identifier. Simply call `Sideshow.gotoStep(3)` or `Sideshow.gotoStep(\"creating_users\")`. \n\n--------\nIt's also possible to skip a step if some condition is true: \n\nwith the step property `skiIf` you can set an evaluator which is called in the entrance of the step, and if this evaluator function return true, the step is automatically skipped.",
			format: "markdown"
		},
		{
			title: "Related Tutorials",
			text: "You can also define relationships between tutorials, this way, after finishing a tutorial, the user sees a list of others related to this.",
			format: "markdown"
		},
		{
			title: "Tutorial Eligibility Conditions", 
			text: function(){/*
It's possible to define if a tutorial is eligible for a specific context (a screen, URL, some specific application state, or any other thing which can be tested programmatically). If your tutorials are registered and imported globally, for your whole application, you can create rules for each one (if it will be listed in the Sideshow menu).

For example, you may want to do something like this:

<pre>
	<code>
affects: [
	{ hash: "#/messages" },
	{ route: "/adm/orders", caseSensitive: true },
	function(){
		return $(".grid").length > 0;
	}
]
	</code>
</pre>

In the code above, we're making some fictional tutorial available in three differente situations: 

*	When the URL hash is "#/messages"
*	When the route is "/adm/orders". Note we're setting a caseSensitive flag to true (this is useful, for instance, for *nix based web servers), so this tutorial will not be listed in a route "#/ADM/routes".
*	We've added a custom evaluator which just checks if there's some grid (or any element with a `grid` class attribute) in the page, if so, the tutorial is eligible for the current page.
			*/},
			format: "markdown"
		},
		{
			title:  "That's (NOT) all, folks!",
			text: "There's a wide variety of interesting features in this version of Sideshow, some of which we didn't mention in this introductory tutorial. Take this sample, the documentation, open your favorite editor for Javascript and play at will!"
		}
    ]
});
