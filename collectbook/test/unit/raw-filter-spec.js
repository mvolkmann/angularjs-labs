'use strict';
/*global angular: false, beforeEach: false, describe: false, expect: false,
         inject: false, it: false */

describe('objToArr filter', function () {
  beforeEach(module('CollectBook'));

  it('should provide SCE', inject(function (rawFilter) {
    var html = '<div>playing card heart is &heart;</div>';

    var actual = rawFilter(html);
    expect(typeof actual).toBe('object');

    var fn = actual.$$unwrapTrustedValue;
    expect(typeof fn).toBe('function');

    expect(fn()).toBe(html);
  }));
});
