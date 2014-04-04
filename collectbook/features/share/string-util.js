'use strict';
/*jshint esnext: true */

var camelRe = /[ ]+[a-zA-Z0-9-]/g;

export function camelCase(str) {
  return str.charAt(0).toLowerCase() +
    str.substring(1).replace(camelRe, arg => arg.trim().toUpperCase());
}
