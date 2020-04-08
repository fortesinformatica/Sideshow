# Version 0.4.3 taxi-driver (2015-03-19)

## General
- Position the arrows which point at `targets`, by providing the `arrowPosition` property to the step object. Valid values are `top`, `right`, `bottom` and `left`.

------------------------------------------------------------

# Version 0.4.2 platoon (2015-03-10)

## General
- Now, you can start a wizard directly, by calling the `Sideshow.start` method passing the option `wizardName`, which is the unique name for the wizard you want to start.

------------------------------------------------------------

# Version 0.4.1 the-hobbit (2014-11-27)

## Fixes
- After yanking the version 0.4.0 of the gem and removed the NuGet package too, I'm republishing them...

------------------------------------------------------------

# Version 0.4.0 citizen-kane (2014-11-27)

## General
- Replaced old shell script build with Gulp
- Replaced Sass+Compass with Stylus
- Removed any Ruby dependency
- Distributing Sideshow as a NuGet package, a Ruby Gem and a Bower component.

## Fixes
- Fixed a bug in the polling functions for monitoring subject and targets changes. 

------------------------------------------------------------

# Version 0.3.5 volver (2014-05-29)

## General
- Added a translation to spanish (thanks for this translation Luis Alfaro de la Fuente!)

## Fixes
- Fixing a bug with the option autoSkipIntro (when it's true), where in the end of a wizard an exception occurred and Sideshow couldn't close properly.
- Lifted up the target arrows, to avoid them to cover the target content.

------------------------------------------------------------

# Version 0.3.4 the-untouchables (2014-05-28)

## General
- Added a configuration option for skipping the intro screen (the tutorials list) if there's just one tutorial available for some context.

------------------------------------------------------------

# Version 0.3.3 raging-bull (2014-01-10)

## General
- Changed licensing to Apache License 2.0 (Now Sideshow is open source software bro! Yeah!!)
- Replaced Google Closure by UglifyJS; though Google Closure compress ratio is a higher (when in Advanced Mode), there are some issues with dead code detection and UglifyJS is considerably faster.
- Changed build script to resolve dependencies in a similar way as Sprocket does

------------------------------------------------------------
There's no changelog before the 0.3.3 version since we became public in this version.
