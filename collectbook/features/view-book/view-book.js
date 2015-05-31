'use strict';
/*jshint esnext: true */
/*global $: false, angular: false */

var app = angular.module('CollectBook');

import Item from '../models/item.js';

// These are types whose name matches that of
// a valid HTML5 input type attribute value.
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
  ($scope, $state, cbHandleErr, collectBookSvc, book, items) => {
    $scope.book = book.data;
    $scope.filter = {};
    $scope.item = new Item();
    $scope.items = items.data;

    function resetInput() {
      $scope.item = new Item(); // prepares for adding an item
      $scope.editing = false; // hides editing form
      $('input:first').focus(); // TODO: Why doesn't this work!
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

    $scope.addOrUpdateItem = () => {
      collectBookSvc.addItem($scope.book.id, $scope.item).then(
        () => {
          $scope.items[$scope.item.id] = $scope.item;
          resetInput();
        },
        cbHandleErr);
    };

    $scope.deleteItem = item => {
      // TODO: Consider asking the user to confirm this action.
      collectBookSvc.deleteItem($scope.book.id, item.id).then(
        () => {
          delete $scope.items[item.id];
          resetInput();
        },
        cbHandleErr);
    };

    // This changes the ui-router state so the user can
    // add fields to a book that has none.
    $scope.editBook = bookId => $state.go('editBook', {bookId: bookId});

    // This is called when a table row for an item is clicked.
    $scope.editItem = item => {
      $scope.editing = true;
      $scope.item = item;
      $('input:first').focus(); // TODO: Why doesn't this work?
    };

    $scope.getFieldClass = field => {
      // Right-align integer values, but no others.
      return field.type === 'integer' ? 'right' : '';
    };

    $scope.inputClass = field => {
      var type = field.type;
      // All input types except boolean should use
      // the Twitter Bootstrap "form-control" CSS class.
      return type === 'boolean' ? '' : 'form-control';
    };

    $scope.inputType = field => {
      var type = field.type;
      // Return the proper HTML5 input type attribute value
      // for the type of this field.
      return IDENTITY_TYPES.indexOf(type) != -1 ? type :
        type === 'boolean' ? 'checkbox' :
        type === 'integer' ? 'number' :
        'text';
    };
  
    $scope.sortOn = field => {
      // Toggle the direction of the sort
      // if the previous sort was on the same field.
      $scope.reverse =
        field === $scope.sortField && !$scope.reverse;

      // Remember that the current sort is on this field.
      $scope.sortField = field;

      // Cause the ng-repeat in view-book.html to do the sort.
      $scope.sortKey = field.propertyName;
    };
  }
);
