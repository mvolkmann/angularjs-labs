'use strict';
/*global describe: false, expect: false, it: false */
describe('KarmaDemo module', function () {
  var module = angular.module('CollectBook');

  it('should exist', function () {
    expect(module).not.toBeNull();
  });

  it('should have correct dependencies', function () {
    expect(module.requires.length).toBe(3);
    expect(module.requires).toContain('cb-directives');
    expect(module.requires).toContain('cb-filters');
    expect(module.requires).toContain('ui.router');
  });
});
