'use strict';
/*global beforeEach: false, browser: false, by: false, describe: false,
  element: false, expect: false, it: false, protractor: false, xit: false */
var share = require('./share');

describe('edit-book', function () {
  beforeEach(share.before);

  it('should edit book', function () {
    share.createTestBook();
    share.editTestBook();

    // Verify that the field appears in the table.
    var table = element(by.tagName('table'));
    var trs = table.findElements(by.tagName('tr'));
    trs.then(function (rows) {
      expect(rows.length).toBe(2); // header row and row for new field

      var tr = rows[1];
      var tds = tr.findElements(by.tagName('td'));
      tds.then(function (columns) {
        expect(columns[0].getText()).toBe(share.fieldName);
        expect(columns[1].getText()).toBe(share.fieldType);
        expect(columns[2].getText()).toBe(share.fieldPlaceholder);
        expect(columns[3].getText()).toBe('true');

        // Delete the field.
        columns[4].click();

        // Verify that the field was removed from the table.
        trs = table.findElements(by.tagName('tr'));
        trs.then(function (rows) {
          expect(rows.length).toBe(1); // only header row
        });

        share.deleteTestBook();
      });
    });
  }, 5000); // five second timeout
});
