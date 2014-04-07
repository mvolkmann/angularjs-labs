'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false */

function selectOption(selectElement, optionText) {
  selectElement.findElements(by.tagName('option')).then(function (options) {
    options.forEach(function (option) {
      option.getText().then(function (text) {
        if (text === optionText) option.click();
      });
    });
  });
}

describe('edit-book', function () {
  var ptor;

  beforeEach(function () {
    browser.get('http://localhost:3000/');
    ptor = protractor.getInstance();
  });

  it('should edit book', function () {
    var btnText = 'Foo Bar Baz';

    // Create a new book.
    element(by.id('add-btn')).element(by.tagName('a')).click();
    element(by.id('name')).sendKeys(btnText);
    element(by.buttonText('Add')).click();

    // Verify that a nav button was added for it.
    var nav = element(by.id('nav'));
    var btn = element(by.buttonText(btnText));
    expect(btn.isPresent()).toBe(true);

    // Switch to the "edit" view for the new book.
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

    // Verify that the field appears in the table.
    var table = element(by.tagName('table'));
    var trs = table.findElements(by.tagName('tr'));
    trs.then(function (rows) {
      expect(rows.length).toBe(2); // header row and row for new field

      var tr = rows[1];
      var tds = tr.findElements(by.tagName('td'));
      tds.then(function (columns) {
        expect(columns[0].getText()).toBe(fieldName);
        expect(columns[1].getText()).toBe(fieldType);
        expect(columns[2].getText()).toBe(fieldPlaceholder);
        expect(columns[3].getText()).toBe('true');

        // Delete the field. TODO: THIS ISN'T WORKING!
        columns[3].click();

        // Verify that the field was removed from the table.
        trs = table.findElements(by.tagName('tr'));
        trs.then(function (rows) {
          expect(rows.length).toBe(1); // only header row
        });

        // Delete the new book.
        deleteBtn.click();
        ptor.switchTo().alert().accept(); // press "OK" button in alert
      });
    });
  }, 5000); // one second timeout
});
