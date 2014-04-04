'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

var app = angular.module('CollectBook');

import Item from '../models/item';

var IDENTITY_TYPES = ['color', 'date', 'email', 'url'];

app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.
    state('viewBook', {
      url: '/view/:bookId',
      views: {
        nav: app.navConfig,
        content: {
          templateUrl: 'features/view-book/view-book.html',
          controller: 'ViewBookCtrl',
          resolve: {
            book: (collectBookSvc, $stateParams) => {
              var bookId = $stateParams.bookId;
              return collectBookSvc.getBook(bookId);
            },
            items: (collectBookSvc, $stateParams) => {
              var bookId = $stateParams.bookId;
              return collectBookSvc.getItems(bookId);
            }
          }
        }
      }
    });
});

app.controller('ViewBookCtrl',
  ($scope, $state, $stateParams, collectBookSvc, book, items) => {
    $scope.book = book.data;
    $scope.filter = {};
    $scope.items = items.data;
    $scope.item = new Item();

    function resetInput() {
      $scope.item = new Item();
      $scope.editing = false;
      $('input[1]').focus(); // TODO: Doesn't work!
    }
    resetInput();

    // If a filter for a numeric property is an empty string,
    // it excludes undefined values.
    // Deleting the filter property fixes this.
    $scope.$watchCollection('filter', function () {
      var filter = $scope.filter;
      Object.keys(filter).forEach(function (key) {
        if (filter[key] === '') delete filter[key];
      });
    });

    $scope.addItem = () => {
      collectBookSvc.addItem($scope.book.id, $scope.item).then(
        () => {
          $scope.items[$scope.item.id] = $scope.item;
          resetInput();
        },
        app.handleError);
    };

    $scope.deleteItem = item => {
      collectBookSvc.deleteItem($scope.book.id, item.id).then(
        () => {
          delete $scope.items[item.id];
          resetInput();
        },
        app.handleError);
    };

    $scope.editBook = bookId => $state.go('editBook', {bookId: bookId});

    $scope.editItem = item => {
      $scope.editing = true;
      $scope.item = item;
      $('input:first').focus();
    };

    $scope.getFieldClass = field => {
      return field.type === 'integer' ? 'right' : '';
    };

    $scope.inputClass = field => {
      var type = field.type;
      return type === 'boolean' ? '' :
        'form-control';
    };

    $scope.inputType = field => {
      var type = field.type;
      return IDENTITY_TYPES.indexOf(type) != -1 ? type :
        type === 'boolean' ? 'checkbox' :
        type === 'integer' ? 'number' :
        'text';
    };
  
    $scope.sortOn = field => {
      $scope.reverse =
        field === $scope.sortField && !$scope.reverse;
      $scope.sortField = field;
      $scope.sortKey = field.propertyName;
      console.log('sortOn: $scope.sortKey =', $scope.sortKey);
      console.log('sortOn: $scope.reverse =', $scope.reverse);
    };
  }
);
