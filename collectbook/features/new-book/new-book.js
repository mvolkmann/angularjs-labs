'use strict';
/*jshint esnext: true */
/*global angular: false */

import Book from '../models/book';

var app = angular.module('CollectBook');

app.config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.
    state('newBook', {
      url: '/new',
      views: {
        nav: app.navConfig,
        content: {
          templateUrl: 'features/new-book/new-book.html',
          controller: 'NewBookCtrl'
        }
      }
    });
});

app.controller('NewBookCtrl', ($scope, cbHandleErr, collectBookSvc) => {
  $scope.book = new Book();

  $scope.addBook = () => {
    collectBookSvc.addBook($scope.book).then(
      url => {
        //console.log('new-book: created', url.data);

        // Add the book object to the array of them in the parent scope
        // so the nav will display it.
        $scope.$parent.books.push($scope.book);

        // Prepare to create another new book.
        $scope.book = new Book();
      },
      cbHandleErr);
  };
});
