'use strict';
/*jshint esnext: true */
/*global angular: false */

var mod = angular.module('cb-directives', []);

// ES6 imports of files that add to this module.
import './color-picker.js';
import './dialog.js';
import './keys.js';

mod.byId = function (id) {
  return angular.element(document.getElementById(id));
};
