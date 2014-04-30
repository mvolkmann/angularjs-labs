'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false,
  xdescribe: false */

var share = require('./share');

describe('new-book', function () {
  beforeEach(function () {
    browser.get('http://localhost:3000/');
    share.ptor = protractor.getInstance();
  });

  it('should create new book', function () {
    share.createTestBook();

    // Verify that a nav button was added for it.
    var nav = element(by.id('nav'));
    var btn = element(by.buttonText(share.btnText));
    expect(btn.isPresent()).toBe(true);

    share.deleteTestBook();

    // Verify that the nav button is no longer present.
    btn = element(by.buttonText(share.btnText));
    expect(btn.isPresent()).toBe(false);
  }, 3000); // three second timeout
});
