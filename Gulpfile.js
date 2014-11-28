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
    livereload = require('gulp-livereload'),
    open = require('open'),
    del = require('del'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    util = require('gulp-util'),
    prettify = require('gulp-prettify'),
    beautify = require('gulp-beautify'),
    stylus = require('gulp-stylus'),
    include = require('gulp-include'),
    fs = require('fs'),
    path = require('path'),
    prompt = require('gulp-prompt'),
    yuidoc = require('gulp-yuidoc'),
    bower = require('gulp-bower'),
    unzip = require('gulp-unzip'),
    zip = require('gulp-zip'),
    gzip = require('gulp-gzip'),
    tar = require('gulp-tar'),
    run = require('gulp-run'),
    wait = require('gulp-wait'),
    git = require('gift'),
    repo = git('./'),
    webserverPort = 8080,
    isWin = /^win/.test(process.platform),
    appRoot = path.resolve('.');
    //config = require('./gulp/config');



/* Tasks (will be extracted to separated files) */

//Sideshow's main stylesheet
gulp.task('style', function(){
  compileSideshowStylesheets()
});

//Examples pages Style task
gulp.task('examples-style', function(){
  compileExamplesStylesheet();
});

//Bundle Nexit modules with Browserify
gulp.task('bundle-scripts', function(){
  bundleScripts();
});

//Clean task
gulp.task('clean', function(cb) {
  cleanFiles(cb);
});

//Watch Task
gulp.task('watch', function() {
  pollForChanges();
});

//Webserver task
gulp.task('webserver', function(){
  runDevelopmentWebServer();
});

//Default task
gulp.task('default', function() {
  compileSideshowStylesheets();
  compileExamplesStylesheet();
  // gulp.start('examples-partials');
  runDevelopmentWebServer();
  pollForChanges();

  setTimeout(function(){
    openInBrowser(util.env.browser);
  }, 3000);
});

gulp.task('update-version', function(){
  updateVersionNumberReferences();
});

gulp.task('update-bower', function(){
  updateBowerDependencies();
});

gulp.task('generate-docs', function() {
  generateDocumentation();
});

gulp.task('prepare-build', ['update-version', 'update-bower','clean'], function() {
  console.log('Remember to edit the CHANGELOG file before doing a complete build.');
});

gulp.task('complete-build', function() {
  if(prompt.confirm('Did you run the prepare-build before this?')){
    compileSideshowStylesheets();
    compileExamplesStylesheet();
    bundleScripts(function(){
      generateDocumentation();
    });
  } 
});


gulp.task('pack', function() {
  zipDistributableFiles();
  generatePackages();
});

function zipDistributableFiles(){
  var distr = gulp.src(['./distr*/**/*', './examples*/**/*', 'example.html']);

  distr
  .pipe(zip('sideshow.zip'))
  .pipe(gulp.dest('./'));

  distr
  .pipe(tar('sideshow.tar'))
  .pipe(gzip())
  .pipe(gulp.dest('./'));
}

function generatePackages(){
  var target = util.env.target || 'all';

  del(['*.gem', '*.nupkg'], function(){
    repo.status(function(err, status){
      if(Object.keys(status.files).length === 0){
        var versionFilePath = path.join(appRoot, 'VERSION');

        fs.readFile(versionFilePath, 'utf8', function(err, version) {
          var versionNumber = version.match(/[\d.]+/);

          if(['all', 'github'].indexOf(target) > -1){
            console.log('Generating git tag and push everything.');
            gulp.src('./')
            .pipe(run('git tag -a ' + version + ' -m \'' + version + '\''))
            .pipe(wait(5000))
            .pipe(run('git push --all origin'));
          }
          
          if(['all', 'gem'].indexOf(target) > -1){
            console.log('Building and pushing Sideshow gem');
            gulp.src('./')
            .pipe(run('gem build sideshow.gemspec'))
            .pipe(wait(5000))
            .pipe(run('gem push sideshow-' + versionNumber + '.gem'));
          }

          if(isWin && ['all', 'nuget'].indexOf(target) > -1){
            console.log('Packing and pushing Sideshow nuget package');
            gulp.src('./')
            .pipe(run('nuget pack sideshow.nuspec'))
            .pipe(wait(5000))
            .pipe(run('nuget push sideshow.' + versionNumber + '.nupkg'));
          }
        });
      } else {
        console.log('Before packing a new version you must commit your changes.')
      }
    });
  });
}


function updateBowerDependencies(){
  bower()
  .on('end', function(){
    gulp.src('./bower_components/pagedown/index.zip')
    .pipe(unzip())
    .pipe(gulp.dest('./bower_components/pagedown'))
    .on('end', function(){
      gulp.src('./bower_components/pagedown/pagedown-*/Markdown.Converter.js')
      .pipe(uglify())
      .pipe(rename('pagedown.min.js'))
      .pipe(gulp.dest('./distr/dependencies'));
    });

    gulp.src('./bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./distr/dependencies'));
  });
}

function compileSideshowStylesheets(){
  return gulp.src('stylesheets/sideshow.styl')
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
}

function compileExamplesStylesheet(){
  return gulp.src('examples/stylesheets/styl/example.styl')
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
}

function bundleScripts(endCallback){
  return gulp.src('./src/main.js')
        .pipe(include())
        .on('error', errorHandler('jsbuild_error'))
        .pipe(rename('sideshow.js'))
        .pipe(beautify({indentSize: 2}))
        .pipe(gulp.dest('distr/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./distr/'))
        .on('end', function(){
          //adding copyright message in the expanded version
          gulp.src(['./src/copyright_info.js', './distr/sideshow.js'])
          .pipe(concat('sideshow.js'))
          .pipe(gulp.dest('./distr/'));

          //adding copyright message in the minified version
          gulp.src(['./src/copyright_info.js', './distr/sideshow.min.js'])
          .pipe(concat('sideshow.min.js'))
          .pipe(gulp.dest('./distr/'));

          if(endCallback) endCallback();
        });
}

function cleanFiles(cb){
  del(['distr/*.js', 'tmp/*', 'docs/**/*'], cb);
}

function pollForChanges(){
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
}

function runDevelopmentWebServer(){
  http.createServer(
    ecstatic({ root: __dirname })
  ).listen(webserverPort);

  notify('Web server started. Listening on port ' + webserverPort + '.');
}

function openInBrowser(browser){
  function go(browser){
    return open('http://localhost:' + webserverPort + '/example.html', browser);
  }

  if (browser != 'none'){
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
}

function updateVersionNumberReferences(){
  var version = util.env.version || (function(){ throw "A version number must be passed. Please inform the '--version' argument."; })(),
      name = util.env.name || (function(){ throw "A version name must be passed. Please inform the '--name' argument."; })(),
      appRoot = path.resolve('.'),
      versionFilePath = path.join(appRoot, 'VERSION'),
      yuidocFilePath = path.join(appRoot, 'yuidoc.json'),
      bowerFilePath = path.join(appRoot, 'bower.json'),
      gemspecFilePath = path.join(appRoot, 'sideshow.gemspec'),
      nuspecFilePath = path.join(appRoot, 'sideshow.nuspec'),
      packageJsonFilePath = path.join(appRoot, 'package.json'),
      changelogFilePath = path.join(appRoot, 'CHANGELOG.md'),
      copyrightInfoFilePath = path.join(appRoot, 'src', 'copyright_info.js'),
      variablesFilePath = path.join(appRoot, 'src', 'general', 'variables.js'),
      releaseDate = new Date().toISOString().slice(0,10);

  //VERSION file
  fs.readFile(versionFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    fs.writeFile(versionFilePath, 'v' + version + '-' + name);
  });

  //yuidoc.json
  fs.readFile(yuidocFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    var json = JSON.parse(data);
    json.version = version;

    fs.writeFile(yuidocFilePath, JSON.stringify(json, null, 4));
  });

  //bower.json
  fs.readFile(bowerFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    var json = JSON.parse(data);
    json.version = version;

    fs.writeFile(bowerFilePath, JSON.stringify(json, null, 4));
  });

  //package.json
  fs.readFile(packageJsonFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    var json = JSON.parse(data);
    json.version = version;

    fs.writeFile(packageJsonFilePath, JSON.stringify(json, null, 4));
  });

  //sideshow.gemspec
  fs.readFile(gemspecFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    fs.writeFile(gemspecFilePath, data.replace(/(s.version\s+=\s+)('[\d.]+')/, "$1'" + version + "'"));
  });

  //copyright_info.js
  fs.readFile(copyrightInfoFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    fs.writeFile(copyrightInfoFilePath, data
                                        .replace(/(Version: )([\d.]+)/, '$1' + version)
                                        .replace(/(Date: )([\d-]+)/, '$1' + releaseDate));
  });

  //CHANGELOG file
  fs.readFile(changelogFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    if(data.indexOf('#Version '+ version) == -1){
      var versionChangelogText = '#Version ' + version + ' ' + name + ' (' + releaseDate + ')' +
                                 '\n\n##General' + 
                                 '\n\n##Fixes\n\n' +
                                 Array(61).join('-') + '\n\n';

      fs.writeFile(changelogFilePath, versionChangelogText + data);
    }
  });

  fs.readFile(variablesFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    fs.writeFile(variablesFilePath, data.replace(/(get VERSION\(\) {\s+return )("[\d.]+")/, '$1"' + version + '"'));
  });

  fs.readFile(nuspecFilePath, 'utf8', function(err, data) {
    if (err) throw err;

    fs.writeFile(nuspecFilePath, data.replace(/(<version>)([\d.]+)(<\/version>)/, '$1' + version + '$3'));
  });
}

function generateDocumentation(){
  return gulp.src("./distr/sideshow.js")
        .pipe(yuidoc())
        .pipe(gulp.dest("./docs"));
}

function errorHandler(title){
  return function(error){
    console.log((title || 'Error') + ': ' + error.message); 
    notify((title || 'Error') + ': ' + error.message); 
  };
}

function autoPrefixerConfig(){
  return autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4');
}
