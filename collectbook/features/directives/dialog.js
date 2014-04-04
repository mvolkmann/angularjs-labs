'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

var mod = angular.module('cb-directives');

mod.factory('cbDialogSvc', () => {
  var svc = {};

  svc.show = id => {
    var dialog = $('#' + id);
    dialog.modal('show');
  };

  return svc;
});

/**
 * Example usage:
 * <cb-dialog id="myDialog" title="Make a Move" btn-map="btnMap">
 *   ... content goes here ...
 * </cb-dialog>
 * where btnMap is an object on the scope
 * whose keys are the text for buttons in the footer and
 * whose values are functions to invoke when the buttons are pressed.
 * Omit btn-map if no buttons are needed.
 * In that case there will be no footer area.
 * To display the dialog,
 * cbDialogSvc.show('myDialog');
 */
mod.directive('cbDialog', () => ({
  restrict: 'AE',
  templateUrl: 'features/directives/dialog.html',
  replace: true,
  transclude: true,
  scope: {
    btnMap: '=',
    title: '@'
  }
}));
