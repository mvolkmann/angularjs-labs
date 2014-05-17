#!/usr/bin/env node
'use strict';
/*jshint esnext: true */

var child_process = require('child_process');
var fs = require('fs');
var newline = require('os').EOL; //'\n';
var rimraf = require('rimraf');

var onWindows = /^win/.test(process.platform);

function exit(msg) {
  console.error(msg);
  process.exit(1);
}

// Get the first command-line argument.
var filePath = process.argv[2];
if (!filePath) {
  exit('usage: node genlab.js {lab-name}.txt');
}

// Read all the lines in the file.
var options = {encoding: 'utf8'};
var lines = fs.readFileSync(filePath, options).split(newline);

var lineIndex = 0;
function nextLine() {
  return lines[lineIndex++];
}

// Get srcDir.
var line = nextLine();
console.log(line);
var match = line.match(/^srcDir (.+)$/);
if (!match) exit('first line must start with "srcDir"');
var srcDir = match[1];

// Get destDir.
line = nextLine();
match = line.match(/^destDir (.+)$/);
if (!match) {
  throw 'second line must start with "destDir"';
}
var destDir = match[1];

// Get first file to process.
line = nextLine();
match = line.match(/^file (.+)$/);
if (!match) {
  throw 'third line must start with "file"';
}
var firstFile = match[1];

// Remove destDir if it already exists.
console.log('removing', destDir, 'directory');
rimraf.sync(destDir);

// Copy srcDir to a new directory with the name of the lab.
console.log('copying', srcDir, 'directory to', destDir);
var cmd = onWindows ?
  //'xcopy /e .\\' + srcDir + ' .\\' + destDir + '\\\\ /exclude:excludes.txt' :
  'robocopy ' + srcDir + ' ' + destDir +
  ' /s /xd build node_modules > log:Nul' :
  'rsync -a --exclude build --exclude node_modules ' + srcDir + '/ ' + destDir;
console.log('copy command is', cmd);
child_process.exec(cmd, function (err) {
  if (err && !onWindows) exit(err);
  processFile(firstFile);
});

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

function processFile(filePath) {
  console.log('modifying', filePath);

  var path = destDir + '/' + filePath;
  var oldLines = fs.readFileSync(path, options).split(newline);

  processMods(filePath, oldLines);

  // Write over old file.
  fs.writeFile(path, oldLines.join(newline));

  var line = nextLine();
  if (!line) return; // end of file

  var match = line.match(/^file (.+)$/);
  if (!match) exit('expected file path but found', line);
  processFile(match[1]);
}

function processMods(filePath, oldLines) {
  var line = nextLine();

  while (true) {
    processMod(filePath, line, oldLines);

    line = nextLine();
    if (!line) break; // end of file

    var match = line.match(/^file (.+)$/);
    if (match) { // new file to process
      lineIndex--; // back up one one
      break;
    }
  }
}

function processMod(filePath, startRe, oldLines) {
  var line = nextLine();
  var length = parseInt(line, 10);
  if (isNaN(length)) {
    exit('invalid length after ' + startRe + ' for ' + filePath);
  }

  // Get lines up to the next empty line.
  var newLines = [];
  while (true) {
    line = nextLine();
    if (!line) break;
    if (line === '\\n') line = '';
    newLines.push(line);
  }

  // Find start of line range using startRe.
  var startIndex = findMatchingLine(oldLines, startRe);
  if (startIndex === -1) {
    exit('no match found in ' + filePath + ' for ' + startRe);
  }
  //console.log('genLab2: re', startRe, 'matched at index', index);

  var endIndex = startIndex + length - 1;
  /*
  console.log('replacing lines',
    startIndex + 1, 'to', endIndex + 1,
    'with\n' + newLines.join('\n') + '\n');
  */
  var numLines = endIndex - startIndex + 1;
  var args = [startIndex, numLines].concat(newLines);
  oldLines.splice.apply(oldLines, args);
}
