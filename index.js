var sass = require('node-sass');
var path = require('path');
var fs = require('fs');
var async = require('async')

module.exports = function(builder) {
  builder.hook('before styles', function(pkg, next) {

    // No styles in this package
    if(!pkg.conf.styles) return next();

    // Get all the coffee files from the scripts list
    var sassfiles = pkg.conf.styles.filter(function(file){
      return path.extname(file) === '.scss';
    });

    // No sass files
    if( sassfiles.length === 0 ) return next();

    // Get the real path for each file relative to the package
    var realSassFiles = sassfiles.map(pkg.path);

    // Function to compile sass files that will include the package
    // load paths as Sass load paths
    var compileSassFile = function(buffer, callback) {
       sass.render(buffer.toString(), callback, { includePaths: pkg.conf.paths });
    };

    // Read all the sass files
    async.map(sassfiles, fs.readFile, function(err, results){
      if(err) return next(err);

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