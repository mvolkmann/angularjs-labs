'use strict';
/*global angular: false, beforeEach: false, describe: false, expect: false,
         inject: false, it: false */

describe('cbDialogSvc service', function () {
  beforeEach(module('cb-directives'));

  it('should set $rootSscope properties',
    inject(function ($rootScope, cbDialogSvc) {
      var title = 'some title';
      var msg = 'some message';
      cbDialogSvc.showMessage(title, msg);
      expect($rootScope.title).toBe(title);
      expect($rootScope.message).toBe(msg);
    }));
});
