//All Requires
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    csslint = require('gulp-csslint'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    open = require('open'),
    del = require('del'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    util = require('gulp-util'),
    browserify = require('gulp-browserify'),
    prettify = require('gulp-prettify'),
    extender = require('./gulp/extensions/gulp-html-extend'),
    stylus = require('gulp-stylus');
    //config = require('./gulp/config');



/* Tasks (will be extracted to separated files) */

//Style task
gulp.task('style', function(){
  //Sideshow's main stylesheet
  gulp.src('stylesheets/sideshow.styl')
  .pipe(stylus())
  .on('error', errorHandler('sideshow_stylesheet_compiling_error'))
  .pipe(autoPrefixerConfig())
  .on('error', errorHandler('sideshow_stylesheet_autoprefixing_error'))
  .pipe(rename('sideshow.css'))
  .pipe(gulp.dest('tmp'))
  .pipe(csslint('.csslintrc'))
  .pipe(csslint.reporter())
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('distr/stylesheets'));

  //Font face stylesheet
  gulp.src('stylesheets/sideshow-fontface.styl')
  .pipe(stylus())
  .on('error', errorHandler('fontface_stylesheet_compiling_error'))
  .pipe(autoPrefixerConfig())
  .on('error', errorHandler('fontface_stylesheet_autoprefixing_error'))
  .pipe(rename('sideshow-fontface.min.css'))
  .pipe(minifycss())
  .pipe(gulp.dest('distr/fonts'));
});

//Examples pages Style task
gulp.task('examples-style', function(){
  gulp.src('examples/stylesheets/styl/example.styl')
  .pipe(stylus())
  .on('error', errorHandler('examples_stylesheet_compiling_error'))
  .pipe(autoPrefixerConfig())
  .on('error', errorHandler('examples_stylesheet_autoprefixing_error'))
  .pipe(rename('example.css'))
  .pipe(gulp.dest('tmp'))
  .pipe(csslint('.csslintrc'))
  .pipe(csslint.reporter())
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('examples/stylesheets'));
});

//Compiles the partials for the Examples Pages
gulp.task('examples-partials', function(){
  gulp.src('examples/partials/*.html')
  .pipe(extender())
  .pipe(prettify({indent_size: 4}))
  .pipe(gulp.dest('./examples'));
});

//Bundle Nexit modules with Browserify
gulp.task('bundle-scripts', function(){
  gulp.src('src/main.js')
  .pipe(browserify({
    insertGlobals : false,
    debug: true
  }))
  .on('error', function (err) { console.log(err.message); })
  .pipe(rename('sideshow.js'))
  .pipe(gulp.dest('distr/'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('distr/'));
});

//Clean task
gulp.task('clean', function(cb) {
  del(['distr'], cb);
});

//Watch Task
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['bundle-scripts']);
  gulp.watch('stylesheets/**/*.styl', ['style', 'examples-style']);
  gulp.watch('examples/stylesheets/styl/**/*.styl', ['examples-style']);
  gulp.watch('examples/partials/**/*.html', ['examples-partials']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in distr/, reload on change
  gulp.watch(['examples/stylesheets/example.min.css', 'distr/**']).on('change', function(){
    livereload.changed();
    notify('Changed.');
  });

  notify('Running livereload.');
});


var webserverPort = 8080;

//Webserver task
gulp.task('webserver', function(){
  http.createServer(
    ecstatic({ root: __dirname })
  ).listen(webserverPort);

  notify('Web server started. Listening on port ' + webserverPort + '.');
});

//Open-browser task
function openInBrowser(browser){
  function go(browser){
    return open('http://localhost:' + webserverPort + '/example.html', browser);
  }

  if(browser == 'all'){
    go('firefox');
    go('opera');
    go('safari');
    go('chrome');  
  } else if (browser) 
    go(browser);
  else
    go('firefox');
}

//Default task
gulp.task('default', function() {
  gulp.start('style');
  gulp.start('examples-style');
  gulp.start('examples-partials');
  gulp.start('webserver');
  gulp.start('watch');

  setTimeout(function(){
    openInBrowser(util.env.browser);
  }, 3000);
});

//Complete-build task
gulp.task('complete-build', ['clean'], function() {
  gulp.start('style');
});

function errorHandler(title){
  return function(error){
    console.log(error.message); 
    notify((title || 'Error') + ': ' + error.message); 
  };
}

function autoPrefixerConfig(){
  return autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4');
}
