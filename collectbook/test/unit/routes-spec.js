'use strict';
/*global angular: false, beforeEach: false, describe: false, expect: false,
         inject: false, it: false */
describe('ui-router', function () {
  beforeEach(module('CollectBook'));

  it('should have home route', inject(function ($rootScope, $state) {
    var config = $state.get('home');
    expect(config.name).toBe('home');
    expect(config.url).toBe('/');
    expect(config.views).toBeDefined();
    expect(config.views.nav).toBeDefined();
  }));

  it('should have editBook route', inject(function ($rootScope, $state) {
    var config = $state.get('editBook');
    expect(config.name).toBe('editBook');
    expect(config.url).toBe('/edit/:bookId');
    var views = config.views;
    expect(views).toBeDefined();
    expect(views.nav).toBeDefined();
    var content = views.content;
    expect(content).toBeDefined();
    expect(content.templateUrl).toBe('features/edit-book/edit-book.html');
    expect(content.controller).toBe('EditBookCtrl');
    var resolve = content.resolve;
    expect(resolve).toBeDefined();
    expect(resolve.book).toBeDefined();
  }));

  it('should have newBook route', inject(function ($rootScope, $state) {
    var config = $state.get('newBook');
    expect(config.name).toBe('newBook');
    expect(config.url).toBe('/new');
    var views = config.views;
    expect(views).toBeDefined();
    expect(views.nav).toBeDefined();
    var content = views.content;
    expect(content).toBeDefined();
    expect(content.templateUrl).toBe('features/new-book/new-book.html');
    expect(content.controller).toBe('NewBookCtrl');
  }));

  it('should have viewBook route', inject(function ($rootScope, $state) {
    var config = $state.get('viewBook');
    expect(config.name).toBe('viewBook');
    expect(config.url).toBe('/view/:bookId');
    var views = config.views;
    expect(views).toBeDefined();
    expect(views.nav).toBeDefined();
    var content = views.content;
    expect(content).toBeDefined();
    expect(content.templateUrl).toBe('features/view-book/view-book.html');
    expect(content.controller).toBe('ViewBookCtrl');
    var resolve = content.resolve;
    expect(resolve).toBeDefined();
    expect(resolve.book).toBeDefined();
    expect(resolve.items).toBeDefined();
  }));
});
