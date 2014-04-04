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

app.handleError = err => {
  alert('error: ' + err); // TODO: Do something better.
};

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

app.factory('$exceptionHandler', cbDialogSvc => (exception, cause) => {
  //cbDialogSvc.show('cbDialog');
  alert('JavaScript Error: ' + exception + '; ' + cause);
  throw exception;
});

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

app.controller('MainCtrl', $rootScope => {
  $rootScope.$on('$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      console.log('Error changing state from', fromState.name,
        'to', toState.name, ':', error.data);
      alert('Error changing state from "' + fromState.name +
        '" to "' + toState.name + '": ' + JSON.stringify(error.data));
    });
});
