'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false */

// TODO: Finish this and other tests.
describe('new-book', function () {
  var ptor;

  beforeEach(function () {
    browser.get('http://localhost:3000/');
    ptor = protractor.getInstance();
  });

  it('should create new book', function () {
    var btnText = 'Foo Bar Baz';

    // Create a new book.
    element(by.id('add-btn')).element(by.tagName('a')).click();
    element(by.id('name')).sendKeys(btnText);
    element(by.buttonText('Add')).click();

    // Verify that a nav button was added for it.
    var nav = element(by.id('nav'));
    var btn = element(by.buttonText(btnText));
    expect(btn.isPresent()).toBe(true);

    // Delete the new book.
    var parent = btn.element(by.xpath('..'));
    var icons = parent.element(by.className('icons'));
    var deleteBtn = icons.element(by.className('glyphicon-remove'));
    deleteBtn.click();
    ptor.switchTo().alert().accept(); // press "OK" button in confirmation alert

    // Verify that the nav button is no longer present.
    btn = element(by.buttonText(btnText));
    expect(btn.isPresent()).toBe(false);
  }, 3000); // one second timeout
});
