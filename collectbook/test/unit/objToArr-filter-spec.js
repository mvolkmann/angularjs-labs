'use strict';
/*global angular: false, beforeEach: false, describe: false, expect: false,
         inject: false, it: false */

describe('objToArr filter', function () {
  beforeEach(module('CollectBook'));

  it('should create array from object', inject(function (objToArrFilter) {
    var obj = {
      foo: true,
      bar: 3,
      baz: 'text',
      qux: ['a', 'b', 'c'],
      sub: {alpha: 1, beta: 2}
    };
    var arr = objToArrFilter(obj);
    var expected = [true, 3, 'text', ['a', 'b', 'c'], {alpha: 1, beta: 2}];
    expect(arr).toEqual(expected);
  }));
});
