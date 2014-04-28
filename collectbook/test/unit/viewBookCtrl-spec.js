'use strict';
/*global angular: false, beforeEach: false, describe: false, expect: false,
         inject: false, it: false */

describe('ViewBookCtrl controller', function () {
  var scope;

  beforeEach(function () {
    module('CollectBook');

    // Provide mock versions of "book" and "item" that are
    // normally obtained from a resolve.
    module(function ($provide) {
      $provide.value('book', {data: {}});
      $provide.value('items', {data: []});
    });

    // Create a scope for ViewBookCtrl.
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      $controller('ViewBookCtrl', {$scope: scope});
    });
  });

  it('should edit an item', function () {
    // Test initial state.
    expect(scope.editing).toBe(false);

    // Test state after initiating editing of an item.
    var item = 'any-value';
    scope.editItem(item);
    expect(scope.editing).toBe(true);
    expect(scope.item).toBe(item);

    // Test state after initiating editing of a different item.
    item = 'different-value';
    scope.editItem(item);
    expect(scope.editing).toBe(true);
    expect(scope.item).toBe(item);
  });

  it('should get field CSS class', function () {
    expect(scope.getFieldClass({type: 'integer'})).toBe('right');
    expect(scope.getFieldClass({type: 'anything-else'})).toBe('');
  });

  it('should get input CSS class', function () {
    expect(scope.inputClass({type: 'boolean'})).toBe('');
    expect(scope.inputClass({type: 'anything-else'})).toBe('form-control');
  });

  it('should get input type', function () {
    expect(scope.inputType({type: 'boolean'})).toBe('checkbox');
    expect(scope.inputType({type: 'integer'})).toBe('number');
    expect(scope.inputType({type: 'anything-else'})).toBe('text');
  });

  it('should handle sorting', function () {
    // Sort on a new field for the first time.
    var field = {propertyName: 'some-prop-1'};
    expect(scope.sortOn(field));
    expect(scope.reverse).toBe(false);
    expect(scope.sortKey).toBe(field.propertyName);

    // Sort on the same field again.
    expect(scope.sortOn(field));
    expect(scope.reverse).toBe(true);
    expect(scope.sortKey).toBe(field.propertyName);

    // Sort on a different field.
    field = {propertyName: 'some-prop-2'};
    expect(scope.sortOn(field));
    expect(scope.reverse).toBe(false);
    expect(scope.sortKey).toBe(field.propertyName);
  });
});
