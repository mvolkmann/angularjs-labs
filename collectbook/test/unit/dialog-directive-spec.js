'use strict';
/*global $: false, angular: false, beforeEach: false, describe: false, expect: false,
         inject: false, it: false */

describe('cbDialog directive', function () {
  beforeEach(module('cb-directives', 'features/directives/dialog.html'));

  it('should work', inject(function ($compile, $rootScope, cbDialogSvc) {
    var scope = $rootScope.$new();

    // This is a place where the button functions can store data
    // that will be accessible outside the dialog directive.
    scope.data = {};

    // This defines the buttons that will appear in the dialog footer
    // and what will happen when they are pressed.
    scope.btnMap = {
      'OK': function () {
        scope.data.ok = 'pressed OK';
      },
      'Cancel': function () {
        scope.data.cancel = 'pressed Cancel';
      }
    };

    // Create a dialog.
    var html = '<cb-dialog id="myDialog" ' +
      'title="Some Title" btn-map="btnMap" data="data">' +
      '<h1>Content Header</h1>' +
      '<p>content</p>' +
      '</cb-dialog>';
    var element = angular.element(html);
    $compile(element)(scope);
    scope.$digest();

    // It should have the Twitter Bootstrap CSS class "modal".
    expect(element.hasClass('modal')).toBe(true);

    // Get a reference to the DOM element at the top of the dialog HTML.
    var domEl = element[0];

    // Test the content in the dialog body.
  
    var body = domEl.querySelector('.modal-body');

    var h1 = body.firstChild;
    expect(h1.tagName).toBe('H1');
    expect(h1.textContent).toBe('Content Header');

    var p = body.lastChild;
    expect(p.tagName).toBe('P');
    expect(p.textContent).toBe('content');

    // Test the buttons in the dialog footer.

    // These values are set in the btnMap functions,
    // but shouldn't be set yet.
    expect(scope.data.ok).toBeUndefined();
    expect(scope.data.cancel).toBeUndefined();

    var okBtn = domEl.querySelector('#ok-btn');
    expect(okBtn).not.toBeNull();
    okBtn.click();
    expect(scope.data.ok).toBe('pressed OK');

    var cancelBtn = domEl.querySelector('#cancel-btn');
    expect(cancelBtn).not.toBeNull();
    cancelBtn.click();
    expect(scope.data.cancel).toBe('pressed Cancel');
  }));
});
