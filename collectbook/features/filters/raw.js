'use strict';
/*jshint esnext: true */
/*global angular: false */

var mod = angular.module('cb-filters');

/**
 * This prevents escaping of HTML.
 * It is used in index-in.html to display HTML
 * from server-side errors in an error dialog.
 */
mod.filter('raw', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}]);
