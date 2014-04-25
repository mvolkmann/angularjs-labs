'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

// This is the starting JavaScript file for this web application.

// Create the main AngularJS module,
// specifying the modules on which it depends.
// This line must precede import of modules that use it.
var app = angular.module('CollectBook',
  ['cb-directives', 'cb-filters', 'ui.router']);

// These are ES6 imports of other JavaScript source files.
import './features/directives/main';
import './features/edit-book/edit-book';
import './features/filters/main';
import './features/nav/nav';
import './features/new-book/new-book';
import './features/view-book/view-book';

// This is the prefix for all REST URLs used by this app.
var URL_PREFIX = 'http://localhost:3000/collectbook/';

// Configure the initial ui-router state.
app.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/'); // default route URL

  // Other states are defined in other source files.
  $stateProvider.
    state('home', {
      url: '/',
      views: {
        nav: app.navConfig
        // The home view doesn't display anything in the content area.
      }
    });
});

// Get the prefix for REST URLs related to books.
function getBookUrl(bookId) {
  return URL_PREFIX + 'book/' + bookId;
}

// Get the prefix for REST URLs related to items in a book.
function getItemUrl(bookId, itemId) {
  return URL_PREFIX + 'book/' + bookId + '/item/' + itemId;
}

// Display any uncaught exceptions in a modal dialog.
app.factory('$exceptionHandler', $injector => (exception, cause) => {
  var cbDialogSvc = $injector.get('cbDialogSvc');
  cbDialogSvc.showError('JavaScript Error', exception.message);
  throw exception;
});

// Provide a service function that can be used anywhere in this app
// to display error messages from rejected promises in a modal dialog.
// This is used for REST calls.
app.factory('cbHandleErr', cbDialogSvc =>
  err => cbDialogSvc.showError('Server Error', err.data)
);

// Provide service methods that perform CRUD operations
// on books and items in books.
app.factory('collectBookSvc', $http => {
  var svc = {};

  svc.addBook = book => $http.post(URL_PREFIX + 'book', book);

  svc.addItem = (bookId, item) =>
    $http.post(getBookUrl(bookId) + '/item', item);

  svc.deleteBook = bookId => $http.delete(getBookUrl(bookId));

  svc.deleteItem = (bookId, itemId) => $http.delete(getItemUrl(bookId, itemId));

  svc.getBook = bookId => $http.get(getBookUrl(bookId));

  svc.getBooks = () => $http.get(URL_PREFIX + 'book');

  svc.getItems = bookId => $http.get(getBookUrl(bookId) + '/item');

  svc.updateBook = book => $http.put(getBookUrl(book.id), book);

  return svc;
});

// When an error occurs from an attempted ui-router state change,
// display it in a modal dialog.
app.controller('MainCtrl', ($scope, cbDialogSvc) => {
  $scope.version = angular.version;

  $scope.$root.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      cbDialogSvc.showError(
        'Error changing state from "' + fromState.name +
        '" to "' + toState.name + '"',
        error.data);
    });
});
