'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false, xit: false */

function selectOption(selectElement, optionText) {
  selectElement.findElements(by.tagName('option')).then(function (options) {
    options.forEach(function (option) {
      option.getText().then(function (text) {
        if (text === optionText) option.click();
      });
    });
  });
}

describe('view-book', function () {
  var ptor;

  beforeEach(function () {
    browser.get('http://localhost:3000/');
    ptor = protractor.getInstance();
  });

  it('should view book', function () {
    var btnText = 'Foo Bar Baz';

    // TODO: Use the same code as in edit-book-spec.js
    // TODO: to create and configure a test book
    // TODO: rather than duplicating it here.

    // Create a new book.
    element(by.id('add-btn')).element(by.tagName('a')).click();
    element(by.id('name')).sendKeys(btnText);
    element(by.buttonText('Add')).click();

    // Switch to the "edit" view for the new book.
    var btn = element(by.buttonText(btnText));
    var parent = btn.element(by.xpath('..'));
    var icons = parent.element(by.className('icons'));
    var editBtn = icons.element(by.className('glyphicon-wrench'));
    var deleteBtn = icons.element(by.className('glyphicon-remove'));
    editBtn.click();

    // Add a field.
    var fieldName = 'Email';
    var fieldType = 'email';
    var fieldPlaceholder = 'home email address';
    element(by.id('name')).sendKeys(fieldName);
    selectOption(element(by.id('type')), fieldType);
    var placeholder = element(by.id('placeholder'));
    placeholder.clear();
    placeholder.sendKeys(fieldPlaceholder);
    element(by.id('required')).click();
    element(by.buttonText('Add')).click();

    // Switch to the "view" view for the new book.
    btn.click();

    // Expand to add items.
    element(by.id('expand-form')).click();

    // Enter a value in the first field.
    var value = 'mark@ociweb.com';
    var field = element(by.className('form-control'));
    field.clear();
    field.sendKeys(value);

    // Click "Update" button.
    element(by.buttonText('Update')).click();

    // Verify that the new item appears in the table.
    var table = element(by.tagName('table'));
    var trs = table.findElements(by.tagName('tr'));
    trs.then(function (rows) {
      // header row, filter row, and row for new field
      expect(rows.length).toBe(3);

      var tr = rows[2];
      var tds = tr.findElements(by.tagName('td'));
      tds.then(function (columns) {
        expect(columns[0].getText()).toBe(value);

        // Delete the item.
        columns[1].click();

        // Verify that the field was removed from the table.
        trs = table.findElements(by.tagName('tr'));
        trs.then(function (rows) {
          expect(rows.length).toBe(2); // only header and filter rows
        });

        // Delete the new book.
        deleteBtn.click();
        ptor.switchTo().alert().accept(); // press "OK" button in alert
        // Testing deleting a book is done in new-book-spec.js
      });
    });
  }, 5000); // five second timeout
});
