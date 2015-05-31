'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

var app = angular.module('CollectBook');

import Field from '../models/field.js';

app.config(($stateProvider) => {
  $stateProvider.
    state('editBook', {
      url: '/edit/:bookId',
      views: {
        nav: app.navConfig,
        content: {
          templateUrl: 'features/edit-book/edit-book.html',
          controller: 'EditBookCtrl',
          resolve: {
            book: (collectBookSvc, $stateParams) => {
              var bookId = $stateParams.bookId;
              return collectBookSvc.getBook(bookId);
            }
          }
        }
      }
    });
});

function getPlaceholder(type) {
  return type === 'date' ? 'mm/dd/yyyy' :
    type === 'email' ? 'name@domain.tld' :
    type === 'float' ? '3.14' :
    type === 'integer' ? '42' :
    type === 'price' ? '1.25' :
    type === 'time' ? 'hh:mm' :
    type === 'url' ? 'http://domain.tld/path' :
    '';
}

app.controller('EditBookCtrl',
  ($scope, $stateParams, book, cbHandleErr, collectBookSvc) => {

  $scope.book = book.data;

  $scope.$watch('field.type', type => {
    $scope.field.placeholder = getPlaceholder(type);
  });

  function resetInput() {
    $scope.field = new Field();
    $scope.field.type = 'text'; // default selected option
    $('#name').focus(); // TODO: Do with native DOM?
  }
  resetInput();

  function updateBook() {
    collectBookSvc.updateBook($scope.book).then(
      () => {},
      cbHandleErr);
  }

  $scope.addField = () => {
    $scope.book.fields.push($scope.field);
    updateBook();
    resetInput();
  };

  $scope.deleteField = (field) => {
    var name = field.displayName;
    $scope.book.fields = $scope.book.fields.filter(field => {
      return field.displayName !== name;
    });
    updateBook();
  };
});
