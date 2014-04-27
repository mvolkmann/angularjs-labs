'use strict';
/*jshint esnext: true */
/*global angular: false */

var mod = angular.module('cb-directives');

// This service provides methods for operating on dialogs.
mod.factory('cbDialogSvc', ($rootScope) => {
  var svc = {};

  /**
   * Hides a given dialog.
   */
  svc.hide = id => mod.byId(id).modal('hide');

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
    var dialog = mod.byId(id);
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
    console.log('dialog showMessage: title =', title);
    console.log('dialog showMessage: message =', message);
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
 *
 * btnMap is an object on the scope
 * whose keys are the text for buttons in the footer and
 * whose values are functions to invoke when the buttons are pressed.
 * Omit btn-map if no buttons are needed at the bottom of the dialog.
 * In that case there will be no footer area.
 *
 * data is an object on the scope that can be used to
 * make data available to the trancluded HTML
 * and make result data available to the code
 * that causes the dialog to be displayed.
 * It can also hold functions to be invoked
 * when specific buttons are pressed.
 *
 * busyRef is a scope property. When it is truthy,
 * a spinner GIF will be displayed in the footer to indicate
 * that something is happening that the user should wait for.
 *
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
    busyRef: '=',
    data: '=',
    title: '@'
  },
  link: function (scope) {
    scope.getId = function (text) {
      return text.toLowerCase().replace(/ /g, '-') + '-btn';
    };
  }
}));
