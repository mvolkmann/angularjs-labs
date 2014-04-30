'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false, xit: false */

var share = {
  btnText: 'Foo Bar Baz',
  fieldName: 'Email',
  fieldType: 'email',
  fieldPlaceholder: 'home email address',
  ptor: null // TESTS MUST SET THIS!
};

function selectOption(selectElement, optionText) {
  selectElement.findElements(by.tagName('option')).then(function (options) {
    options.forEach(function (option) {
      option.getText().then(function (text) {
        if (text === optionText) option.click();
      });
    });
  });
}

share.createTestBook = function () {
  // Create a new book.
  element(by.id('add-btn')).element(by.tagName('a')).click();
  element(by.id('name')).sendKeys(share.btnText);
  element(by.buttonText('Add')).click();
};

share.editTestBook = function () {
  // Switch to the "edit" view for the new book.
  var btn = element(by.buttonText(share.btnText));
  var parent = btn.element(by.xpath('..'));
  var icons = parent.element(by.className('icons'));
  var editBtn = icons.element(by.className('glyphicon-wrench'));
  editBtn.click();

  // Add a field.
  element(by.id('name')).sendKeys(share.fieldName);
  selectOption(element(by.id('type')), share.fieldType);
  var placeholder = element(by.id('placeholder'));
  placeholder.clear();
  placeholder.sendKeys(share.fieldPlaceholder);
  element(by.id('required')).click();
  element(by.buttonText('Add')).click();
};

share.deleteTestBook = function () {
  var btn = element(by.buttonText(share.btnText));
  var parent = btn.element(by.xpath('..'));
  var icons = parent.element(by.className('icons'));
  var deleteBtn = icons.element(by.className('glyphicon-remove'));
  deleteBtn.click();
  dismissAlert();
};

function dismissAlert() {
  // Press "OK" button in alert.
  share.ptor.switchTo().alert().accept();
}

module.exports = share;
