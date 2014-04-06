'use strict';
/*jshint esnext: true */

var child_process = require('child_process');
var fs = require('fs');
var rimraf = require('rimraf');

var onWindows = /^win/.test(process.platform);

// Get the first command-line argument.
var filePath = process.argv[2];
if (!filePath) {
  console.error('usage: node genlab.js {lab-name}.json');
  process.exit(1);
}

/**
 * Returns the index of the first line in an array of lines
 * that matches a given regular expression.
 * An optional startIndex for the search can be specified.
 * Otherwise it starts at index 0.
 */
function findMatchingLine(lines, re, startIndex) {
  re = new RegExp(re);
  if (!startIndex) startIndex = 0;

  var found = false, index;

  for (index = startIndex; index < lines.length; index++) {
    if (re.test(lines[index])) {
      found = true;
      break;
    }
  }

  return found ? index : -1;
}

// Parse the JSON file.
var options = {encoding: 'utf8'};
console.log('parsing',  filePath);
fs.readFile(filePath, options, function (err, content) {
  if (err) {
    console.error(err.code === 'ENOENT' ? 'no such lab file' : err);
    process.exit(2);
  }

  var obj = JSON.parse(content);
  //console.log('genlab: obj =', obj);

  // Remove destDir if it already exists.
  console.log('removing',  obj.destDir, 'directory');
  rimraf.sync(obj.destDir);

  // Copy srcDir to a new directory with the name of the lab.
  console.log('copying', obj.srcDir, 'directory to', obj.destDir);
  var cmd = onWindows ? 'xcopy /s' : 'cp -R';
  cmd += ' ' + obj.srcDir + ' ' + obj.destDir;
  child_process.exec(cmd, function (err) {
    if (err) throw new Error(err);

    //console.log('copied', obj.srcDir, 'to', obj.destDir);

    // For each file in files ...
    obj.files.forEach(function (file) {
      console.log('modifying', file.filePath);

      var path = obj.destDir + '/' + file.filePath;
      var content = fs.readFileSync(path, options);
      var lines = content.split('\n');
      //console.log('genlab: lines =', lines);

      // For each mod in mods ...
      file.mods.forEach(function (mod) {
        //console.log('genlab: mod =', mod);

        // Find start of line range using startRe.
        var startIndex = findMatchingLine(lines, mod.startRe);
        //console.log('genlab: startIndex =', startIndex);
        
        // Find end of line range using length or endRe.
        var endIndex =
          mod.endRe ? findMatchingLine(lines. mod.endRe, startIndex) :
          mod.length !== undefined ? startIndex + mod.length - 1 :
          -1;

        if (startIndex === -1 || endIndex === -1) {
          throw new Error('no match found in ' + path +
            ' for ' + mod.startRe);
        }

        // Make the described replacement.
        //console.log('replacing lines', startIndex, 'to', endIndex,
        //  'with', mod.content);
        var newLines = mod.content.split('\n');
        var numLines = endIndex - startIndex + 1;
        var args = [startIndex, numLines].concat(newLines);
        lines.splice.apply(lines, args);
      }); // end of loop through mods

      //console.log('new content of', file.filePath, 'is', lines);

      // Write over old file.
      fs.writeFile(path, lines.join('\n'));
    }); // end of loop through files
  });
});
