var sass = require('node-sass');
var path = require('path');
var fs = require('fs');
var async = require('async');

module.exports = function(builder) {
  builder.hook('before styles', function(pkg, next) {

    // No styles in this package
    if(pkg.root !== true || !pkg.config.styles) return next();

    // Get all the coffee files from the scripts list
    var sassfiles = pkg.config.styles.filter(function(file){
      return path.extname(file) === '.scss';
    });

    // No sass files
    if( sassfiles.length === 0 ) return next();

    // Sass load paths
    var loadPaths = (pkg.config.paths || []).map(pkg.path).concat(pkg.path('components'));

    // Get the real path for each file relative to the package
    var realSassFiles = sassfiles.map(pkg.path);

    // Function to compile sass files that will include the package
    // load paths as Sass load paths
    var compileSassFile = function(str, callback) {
       sass.render(str, callback, { includePaths: loadPaths });
    };

    // Read all the sass files
    async.map(sassfiles, fs.readFile, function(err, results){
      if(err) return next(err);

      results = results.map(function(data, i){
        return data.toString();
      });

      // Compile them all
      async.map(results, compileSassFile, function(err, compiledFiles){
        if(err) return next(err);

        compiledFiles.forEach(function(data, i){
          pkg.addFile('styles', sassfiles[i], data);
          pkg.removeFile('styles', sassfiles[i]);
        });

        next();
      });
    });

  });
};