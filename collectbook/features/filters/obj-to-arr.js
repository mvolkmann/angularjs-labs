'use strict';
/*jshint esnext: true */
/*global angular: false */

var mod = angular.module('cb-filters');

/**
 * The orderBy filter only works with arrays,
 * not object property values.
 * This is a custom filter that takes an object
 * and returns an array of its property values.
 * Use it before orderBy to sort object property values.
 */
mod.filter('objToArr', () => {
  return obj => angular.isObject(obj) ?
    Object.keys(obj).map(key => obj[key]) : [];
});
