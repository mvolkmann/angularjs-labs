'use strict';
/*jshint esnext: true */

// One or more spaces followed by a valid identifier character.
var camelRe = /[ ]+[a-zA-Z0-9-]/g;

/**
 * Returns the camel-cased version of a given string.
 */
export function camelCase(str) {
  return str.charAt(0).toLowerCase() +
    str.substring(1).replace(camelRe, arg => arg.trim().toUpperCase());
}
