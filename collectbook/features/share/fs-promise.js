'use strict';
/*jshint esnext: true */
/*global Promise: false */

/**
 * This module wraps Node.js fs functions
 * in new functions that return ES6 promises.
 */
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

/**
 * Determines if a given path refers to an existing file or directory.
 */
export function exists(path) {
  return new Promise(resolve => {
    fs.exists(path, exists => resolve(exists));
  });
}

/**
 * Determines if a given path refers to a directory.
 */
export function isDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if (err) return reject(err);
      resolve(stat.isDirectory());
    });
  });
}

/**
 * Creates a directory.
 */
export function mkdir(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Reads the content of a given directory.
 */
export function readDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, filenames) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]); // directory not found, so no contents
        } else {
          reject(err);
        }
      } else {
        resolve(filenames);
      }
    });
  });
}

/**
 * Reads a text file and returns the content.
 */
export function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, {encoding: 'utf8'}, (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  });
}

/**
 * Reads a JSON file and returns a JavaScript value.
 */
export function readObject(filePath) {
  return new Promise((resolve, reject) => {
    readFile(filePath).then(
      content => {
        try {
          resolve(JSON.parse(content));
        } catch (e) {
          reject(e);
        }
      },
      reject);
  });
}

/**
 * Deletes a file.
 */
export function rm(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Deletes a directory, doing the equivalent of "rm -rf".
 */
export function rmdir(dirPath) {
  return new Promise((resolve, reject) => {
    rimraf(dirPath, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Writes text to a file.
 */
export function writeFile(content, filePath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Writes a JavaScript value to a file.
 */
export function writeObject(obj, filePath) {
  var text = JSON.stringify(obj, null, 2) + '\n'; // making it easier to debug
  return writeFile(text, filePath);
}
