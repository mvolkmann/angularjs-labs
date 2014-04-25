'use strict';
/*jshint esnext: true */
/*global angular: false, tinycolor: false */

var mod = angular.module('cb-directives');

/**
 * Example usage:
 * <div cb-color-picker color="scope-property"></div>
 */
mod.directive('cbColorPicker', () => ({
  restrict: 'AE',
  templateUrl: 'features/directives/color-picker.html',
  replace: true,
  scope: {
    color: '='
  },
  //link: scope => { // TODO: Why doesn't this work?
  link: function (scope) {
    var dialog; // can't set now because template may not be loaded yet

    scope.$watch('color', () => {
      // Set fontColor to be the most readable color on top
      // of the selected color between black and white.
      scope.fontColor = '#' +
        tinycolor.mostReadable(scope.color, ['black', 'white']).toHex();
    });

    // These are the colors that will appear in the dialog,
    // in the order in which they will appear.
    scope.colors = [
      ['red', 'orange', 'yellow', 'green'],
      ['blue', 'purple', 'cyan', 'magenta'],
      ['pink', 'lightGreen', 'lightBlue', 'mediumPurple'],
      ['brown', 'white', 'gray', 'black']
    ];

    scope.pick = color => {
      scope.color = color;
      dialog.modal('hide');
    };

    scope.show = () => {
      if (!dialog) {
        //dialog = $('#cbColorPickerDialog'); // uses jQuery
        dialog = mod.byId('cbColorPickerDialog');
      }
      dialog.modal('show');
    };
  }
}));
