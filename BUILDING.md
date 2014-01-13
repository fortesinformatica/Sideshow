#Building
##Prerequisites

###Node.js Modules
```
#for minification
npm -g install uglify-js
#for beautification
npm -g install js-beautify
#for documentation
npm -g install yuidocjs
```

###For Compiling Stylesheets
Wanna change some stylesheet? For now, stylesheets are written in Sass. I really love Sass+Compass marriage and I'd prefer Sass over LESS or Stylus, but since we depend on a Node.js environment for building Sideshow, I'll simplify the things (as soon as possible) by switching from Sass to LESS, this way you won't need to install Ruby+Sass+Compass. 

####Ruby
If you don't have Ruby installed, follow one of these guides (according to your OS):
(Mac OS X) http://stackoverflow.com/questions/12287882/installing-ruby-with-homebrew
(Ubuntu) http://stackoverflow.com/questions/18490591/how-to-install-ruby-2-on-ubuntu-without-rvm
(Windows) There's no need to install, download [this](http://rubyinstaller.org/downloads/) installer then next, next, next... finish! ;D

PS: You won't need Rails neither RVM, just a functional Ruby installation

####Compass
```
#this will install Sass as a Compass dependency
gem install compass
```

##Let's build
```
#in Sideshow root folder
cd build
./build dev (for Development mode, that will just generate uncompressed .debug file)
OR 
./build (for Production mode, that will generate both .debug and .min versions and the full documentation)

##How to compile stylesheets
```
#in stylesheets/SCSS folder
compass watch .
```