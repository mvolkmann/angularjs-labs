'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false, xit: false */
var share = require('./share');

describe('view-book', function () {
  beforeEach(function () {
    browser.get('http://localhost:3000/');
    share.ptor = protractor.getInstance();
  });

  it('should view book', function () {
    share.createTestBook();
    share.editTestBook();

    // Switch to the "view" view for the new book.
    var btn = element(by.buttonText(share.btnText));
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

        share.deleteTestBook();
      });
    });
  }, 5000); // five second timeout
});
