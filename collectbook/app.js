'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

// This line must precede import of modules that use it.
var app = angular.module('CollectBook',
  ['cb-directives', 'cb-filters', 'ui.router']);

import './features/directives/main';
import './features/edit-book/edit-book';
import './features/filters/main';
import './features/nav/nav';
import './features/new-book/new-book';
import './features/view-book/view-book';
var URL_PREFIX = 'http://localhost:3000/collectbook/';

app.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');
  // Other states are defined in other source files.
  $stateProvider.
    state('home', {
      url: '/',
      views: {
        nav: app.navConfig
      }
    });
});

function getBookUrl(bookId) {
  return URL_PREFIX + 'book/' + bookId;
}

function getItemUrl(bookId, itemId) {
  return URL_PREFIX + 'book/' + bookId + '/item/' + itemId;
}

/*
app.factory('$exceptionHandler', $injector => (exception, cause) => {
  var cbDialogSvc = $injector.get('cbDialogSvc');
  cbDialogSvc.showError('JavaScript Error', exception.message);
  throw exception;
});
*/

app.factory('cbHandleErr', cbDialogSvc =>
  //(title, message) => cbDialogSvc.showError(title, message)
  (title, message) => {
    console.log('cbHandleErr: title =', title);
    console.log('cbHandleErr: message =', message);
    //cbDialogSvc.showError(title, message);
  }
);

app.factory('collectBookSvc', $http => {
  var svc = {};

  svc.addItem = (bookId, item) => {
    return $http.post(getBookUrl(bookId) + '/item', item);
  };

  svc.addBook = book => $http.post(URL_PREFIX + 'book', book);

  svc.deleteBook = bookId => $http.delete(getBookUrl(bookId));

  svc.deleteItem = (bookId, itemId) => $http.delete(getItemUrl(bookId, itemId));

  svc.getBook = bookId => $http.get(getBookUrl(bookId));

  svc.getBooks = () => $http.get(URL_PREFIX + 'book');

  svc.getItems = bookId => $http.get(getBookUrl(bookId) + '/item');

  svc.updateBook = book => $http.put(URL_PREFIX + 'book/' + book.id, book);

  return svc;
});

app.controller('MainCtrl', ($rootScope, cbDialogSvc) => {
  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      cbDialogSvc.showError(
        'Error changing state from "' + fromState.name +
        '" to "' + toState.name + '"',
        error.data);
    });
});
