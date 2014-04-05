/*global angular: false */
var mod = angular.module('cb-directives');

// Checks for lowercase and uppercase letters.
function isLetter(code) {
  return code >= 65 && code <= 90;
}

// Checks for delete, tab, and arrow keys.
function isNavigation(event) {
  var code = event.keyCode;
  return !event.shiftKey &&
    (code === 8 || code === 9 ||
     (code >= 37 && code <= 40)); 
}

// Checks for 0 to 9 keys.
function isDigit(event) {
  var code = event.keyCode;
  return !event.shiftKey &&
    ((code >= 48 && code <= 57) ||
      (code >= 96 && code <= 105)); // keypad
}

// Checks for characters allowed in JavaScript names.
function isIdentifier(event) {
  var code = event.keyCode;
  return code === 32 || // space
    isLetter(code) ||
    isDigit(event) ||
    (code === 189 && event.shiftKey); // underscore
}

/**
 * Restricts keys that can be pressed when an input has focus
 * to digit and navigation keys.
 * Example usage: <input type="number" cb-digits-only>
 */
mod.directive('cbDigitsOnly', () => ({
  link: function (scope, element) {
    element.on('keydown', function (event) {
      var valid = isDigit(event) || isNavigation(event);
      // In old versions of IE, event objects
      // do not have the preventDefault method.
      if (!valid && event.preventDefault) event.preventDefault();
      return valid; // for IE8 and earlier
    });
  }
}));

/**
 * Restricts keys that can be pressed when an input has focus
 * to characters that are allowed in JavaScript identifiers,
 * spaces, underscores, and navigation keys.
 * Example usage: <input type="text" cb-identifier>
 */
mod.directive('cbIdentifier', () => ({
  link: function (scope, element) {
    element.on('keydown', function (event) {
      var valid = isIdentifier(event) || isNavigation(event);
      // In old versions of IE, event objects
      // do not have the preventDefault method.
      if (!valid && event.preventDefault) event.preventDefault();
      return valid; // for IE8 and earlier
    });
  }
}));
