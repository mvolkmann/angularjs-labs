'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

var app = angular.module('CollectBook');

app.navConfig = {
  templateUrl: 'features/nav/nav.html',
  controller: 'NavCtrl',
  resolve: {
    books: collectBookSvc => collectBookSvc.getBooks()
  }
};

// Shim for Array findIndex method.
// Can't use arrow function because that
// doesn't give correct value for "this".
Array.prototype.findIndex = function (fn) {
  for (var index = 0; index < this.length; index++) {
    if (fn(this[index])) return index;
  }
  return -1;
};

app.controller('NavCtrl', ($scope, $state, books, collectBookSvc) => {
  $scope.$parent.books = books.data;

  $scope.deleteBook = (bookId, bookName) => {
    var proceed = confirm(
      'Are you sure you want to delete the book "' +
      bookName + '" and all its data?');
    if (proceed) {
      collectBookSvc.deleteBook(bookId).then(
        () => {
          var books = $scope.$parent.books;
          var index = books.findIndex(book => book.id === bookId);
          books.splice(index, 1);
        },
        app.handleError);
    }
  };

  // JSHint doesn't yet understand enhanced object literals.
  $scope.editBook = bookId => $state.go('editBook', {bookId: bookId});

  $scope.viewBook = bookId => $state.go('viewBook', {bookId: bookId});
});
