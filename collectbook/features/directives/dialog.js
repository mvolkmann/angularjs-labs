'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

var mod = angular.module('cb-directives');

// This service provides methods for operating on dialogs.
mod.factory('cbDialogSvc', ($rootScope) => {
  var svc = {};

  /**
   * Hides a given dialog.
   */
  svc.hide = id => $('#' + id).modal('hide');

  /**
   * Shows a given dialog.
   * @param id the id of the HTML element that defines the content
   * @param classes an optional array of CSS class names
   *   to add to that element;
   *   Examples include modal-sm and modal-lg
   *   that are defined by Twitter bootstrap.
   * @param onDismiss an optional function to be called
   *   when the user dismisses the dialog
   */
  svc.show = (id, classes, onDismiss) => {
    var dialog = $('#' + id);
    if (Array.isArray(classes)) {
      classes.forEach(dialog.addClass.bind(dialog));
    }
    dialog.modal('show');
    if (onDismiss) dialog.on('hidden.bs.modal', onDismiss);
  };

  /**
   * Shows an error dialog.
   * @param title displayed in the dialog header
   * @param message displayed in the dialog body
   * @param classes see show method
   * @param onDismiss see show method
   */
  svc.showError = (title, message, classes, onDismiss) => {
    svc.showMessage(title, message, classes, onDismiss);
  };

  /**
   * Shows a message dialog.
   * @param title displayed in the dialog header
   * @param message displayed in the dialog body
   * @param classes see show method
   * @param onDismiss see show method
   */
  svc.showMessage = (title, message, classes, onDismiss) => {
    $rootScope.title = title;
    $rootScope.message = message;
    svc.show('global-error', classes, onDismiss);
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
  replace: true, // TODO: Why doesn't this work?
  transclude: true,
  scope: {
    btnMap: '=',
    title: '@'
  }
}));
