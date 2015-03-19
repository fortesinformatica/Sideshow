#Sideshow

![Sideshow Logo](http://fortesinformatica.github.io/Sideshow/examples/images/sideshow-logo.png)
========
![Google Analytics Beacon](https://ga-beacon.appspot.com/UA-34593010-2/Sideshow/README)
[![Gem Version](https://badge.fury.io/rb/sideshow.svg)](http://badge.fury.io/rb/sideshow)
[![NuGet version](https://badge.fury.io/nu/sideshow.svg)](http://badge.fury.io/nu/sideshow)
[![Bower version](https://badge.fury.io/bo/sideshow.svg)](http://badge.fury.io/bo/sideshow)
[![Node.js devDependency Status](https://david-dm.org/fortesinformatica/sideshow/dev-status.svg)](https://david-dm.org/fortesinformatica/sideshow#info=devDependencies)
[![License](http://img.shields.io/badge/license-Apache_2.0-red.svg)](http://www.apache.org/licenses/LICENSE-2.0)


[Documentation and Live example](http://fortesinformatica.github.io/Sideshow)

Sideshow is a powerful javascript library which aims to reduce your user's learning curve by providing a way to create step-by-step interactive helps. 

*	Explain the features of your application
*	Control your end-user's interaction with your UI
*	Use Markdown to create formatted step descriptions
*	Emphasize what you're explaining in each step (a button, grid, dropdown, form, the whole screen, and so forth) by surrounding it with a fully adaptable mask. 

**Just think! The sky is the limit!**

##Usage
All the files needed to use Sideshow are located under the `distr` folder.

1) 	In your HTML, include Sideshow script, its dependencies (put the dependencies before the Sideshow script) and the stylesheet.

**Note**: The stylesheet must be in the `head` and all the scripts (including your own Tutorial scripts) in the bottom of your `body` tag.

**Note 2**: See the `example.html` file in the project root folder for a real example.

2) 	Copy the Sideshow fonts folder in the directory located above the folder where you copied Sideshow stylesheet.

3) 	Create (and also add a reference in your HTML) a `sideshow.config.js` file with this content:

```Javascript
Sideshow.config.language = "en";
Sideshow.init();
```

**Note**: For now, Sideshow only supports `en` (american english), `pt-br` (brazilian portuguese) and `es` (spanish, translated by Luis Alfaro de la Fuente, thanks!)

4) 	Create your tutorials and import each one in your HTML after the Sideshow script 

###Creating a Tutorial

```Javascript
Sideshow.registerWizard({
    name: "introducing_sideshow",
    title: "Introducing Sideshow",
    description: "Introducing the main features and concepts of Sideshow. ",
    estimatedTime: "10 Minutes",
    affects: [
		{ hash: "#messages" }, //This tutorial would be eligible for URLs like this "http://www.foo.com/bar#messages"
		{ route: "/adm/orders", caseSensitive: true },  //This tutorial would be eligible for URLs like this "http://www.foo.com/adm/orders"
		function(){
			//Here we could do any checking to infer if this tutorial is eligible the current screen/context. 
			//After this checking, just return a boolean indicating if this tutorial will be available. 
			return $(".grid").length > 0;
		}	
    ]
});
```

###Defining a Storyline
A storyline is the sequence of steps of some tutorial. 

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "Hello Sideshow.",
		    text: "This is an oversimplified example."
		},
		{
		    title: "The end",
		    text: "What a pity =(."
		}
	]
});
```

###Step: A complete example

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "The log out button.",
		    text: "Click this button if you want to log out of the system.",
		    subject: "#user_details_panel",
		    targets: "#user_details_panel > .logout"
		}
	]
});
```

###Using Markdown

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "Markdown is pretty cool!",
		    text: "This step uses [Markdown](http://en.wikipedia.org/wiki/Markdown) for **text formatting**.",
		    format: "markdown"
		}
	]
});
```

###Completing Conditions
Completing conditions are just (as the name suggests) conditions to be satisfied in order to proceed to the next step.

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "Choose a name for your project",
		    text: "Enter a name for your project.",
		    completingConditions: [
		    	function(){
		    		return $("#project_name").val().length > 5;
		    	}
		    ]
		},
		//...
	]
});
```

###Auto continue
By setting the autoContinue flag to true, Sideshow proceeds automaticaly when the completing conditions are satisfied.

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "Choose a name for your project",
		    text: "Enter a name for your project.",
		    completingConditions: [
		    	function(){
		    		return $("#project_name").val().length > 5;
		    	}
		    ],
		    autoContinue: true
		},
		//...
	]
});
```

###Events
You can perform some action or do some preparation for the next step, or anything you want which can be done programatically.

```Javascript
Sideshow.registerWizard({
    //...
    listeners: {
    	beforeWizardStarts: function(){
    		//What goes here will be executed before the first step of this tutorial
    	},
    	afterWizardEnds: function(){
    		//What goes here will be executed after the last step of this tutorial
    	}
	}
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    title: "Foo bar",
		    text: "An example of step just to illustrate how to use step events.",
		    listeners: {
		    	beforeStep: function(){
		    		//What goes here will be executed before this step 
		    	},
		    	afterStep: function(){
		    		//What goes here will be executed after this step 
		    	}
			}
		},
		//...
	]
});
```

###Skipping a step
When entering some step you can do some verification to skip the step automaticaly.

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    //...
		    skipIf: function(){
		    	return $("#groups").children().length > 0;
			}
		},
		//...
	]
});
```

###Jumping to other step
You can jump to other step by its position (1-based) or its unique name.

```Javascript
Sideshow.registerWizard({
    //...
}).storyLine({
    showStepPosition: true,
    steps: [
    	{
		    //...
		    listeners: {
		    	beforeStep: function(){
			    	if($("#groups").children().length > 0) 
			    		Sideshow.gotoStep("the_end"); //we're jumping to the step named "the_end"
			    	else if($("#people").children().length > 0) 
			    		Sideshow.gotoStep(7); //we're jumping to the seventh step in this Wizard storyline
				}
			}
		},
		//...
		{
			name: "the_end",
			title: "The end",
			//...
		}
	]
});
```

###Tutorial Eligibility
When a user invokes Sideshow, a list with the tutorials available for the current screen/context is shown. Sideshow knows if a tutorial is eligible for some screen by testing the `affects` conditions of each registered tutorial. If one of the conditions are met, the tutorial is listed.


```Javascript
Sideshow.registerWizard({
    //...
    affects: [
		{ hash: "#messages" }, //This tutorial would be eligible for URLs like this "http://www.foo.com/bar#messages"
		{ route: "/adm/orders", caseSensitive: true },  //This tutorial would be eligible for URLs like this "http://www.foo.com/adm/orders"
		function(){
			//Here we could do any checking to infer if this tutorial is eligible the current screen/context. 
			//After this checking, just return a boolean indicating if this tutorial will be available. 
			return $(".grid").length > 0;
		}	
	]
}).storyLine({
	//...
});
```

###Tutorial Preparation Function
Even if a tutorial isn't eligible for some screen, by using a preparation function a user can access this tutorial from any point of your system/site (by pressing shift-F2).


```Javascript
Sideshow.registerWizard({
    //...
    preparation: function(doneCallback){
    	//if your app is a SPA, you could do some sort of redirection and call the doneCallback function after the page is loaded
	}
}).storyLine({
	//...
});
```

###Related Tutorials
You can also define relationships between tutorials, this way, after finishing a tutorial, the user sees a list of others related to this.


```Javascript
Sideshow.registerWizard({
	//...
	//after finishing the current wizard, the user will be guided to related tutorials
    relatedWizards: [ "creating_user", "groups_and_permissions", "security_settings" ] 
}).storyLine({
	//...
});
```

###Skipping the Intro screen (the tutorial list) automatically if there's just one tutorial available for a given context
In the sideshow.config.js file, set the `autoSkipIntro` option to true:

```Javascript
Sideshow.config.autoSkipIntro = true;
//...other configuration options
Sideshow.init();
```


##Invoking Sideshow##

*	The user can access the tutorials available for the current screen by pressing `F2`, . 
*	The user can access the tutorials available for the current screen + tutorials for other screens with a preparation function by pressing `shift+F2`. 

##Fortes Informática

Sideshow was created by [Alcides Queiroz](https://github.com/alcidesqueiroz), at [Fortes Informática](http://www.fortesinformatica.com.br), a great technology company headquartered in Fortaleza, CE (Brazil). Fortes Informática has several offices across the country, and an impressive history of more than 20 years. Sideshow is making our software yet more easy to use and even more innovative.

##The Sideshow Team (maintainers)

Alcides Queiroz Aguiar 

-	E-mail: alcidesqueiroz(at)gmail(dot)com 
-	Twitter: [@alcidesqueiroz](http://www.twitter.com/alcidesqueiroz)
-	Stack Overflow: [http://stackoverflow.com/users/1295666/alcides-queiroz-aguiar](http://stackoverflow.com/users/1295666/alcides-queiroz-aguiar)
-	Github: [alcidesqueiroz](https://github.com/alcidesqueiroz)
	
Daniel Apt

-	E-mail: info(at)iamapt(dot)com 
-	Twitter: [@danielapt](http://www.twitter.com/danielapt)
-	Stack Overflow: [http://stackoverflow.com/users/1639675/daniel-apt](http://stackoverflow.com/users/1639675/daniel-apt)
-	Github: [danielapt](https://github.com/danielapt)
	

##License and Copyright

Copyright 2013-2015 Alcides Queiroz [alcidesqueiroz(at)gmail(dot)com] 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
