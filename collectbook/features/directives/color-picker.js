'use strict';
/*jshint esnext: true */
/*global $: false, angular: false, tinycolor: false */

var mod = angular.module('cb-directives');

/**
 * Example usage:
 * <cb-color-picker></cb-dialog>
 */
mod.directive('cbColorPicker', () => ({
  restrict: 'AE',
  templateUrl: 'features/directives/color-picker.html',
  //replace: true // using this causes $compile:multidir error
  scope: {
    color: '='
  },
  //link: scope => { // TODO: Why doesn't this work?
  link: function (scope) {
    var dialog;

    scope.colors = [
      ['red', 'orange', 'yellow', 'green'],
      ['blue', 'purple', 'cyan', 'magenta'],
      ['pink', 'lightGreen', 'lightBlue', 'mediumPurple'],
      ['brown', 'white', 'gray', 'black']
    ];

    scope.pick = color => {
      scope.color = color;
      // Set fontColor to be the most readable color on top
      // of the selected color between black and white.
      scope.fontColor = '#' +
        tinycolor.mostReadable(color, ['black', 'white']).toHex();
      dialog.modal('hide');
    };

    scope.show = () => {
      dialog = $('#cbColorPickerDialog');
      dialog.modal('show');
    };
  }
}));
