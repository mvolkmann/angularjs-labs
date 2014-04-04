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

app.controller('NewBookCtrl', ($scope, collectBookSvc) => {
  $scope.book = new Book();

  $scope.addBook = () => {
    var book = $scope.book;
    collectBookSvc.addBook(book).then(
      url => {
        console.log('new-book: created', url.data);
        $scope.$parent.books.push(book);
        $scope.book = new Book();
      },
      app.handleError);
  };
});
