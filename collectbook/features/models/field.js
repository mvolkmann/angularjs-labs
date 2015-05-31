'use strict';
/*jshint esnext: true */

import {camelCase} from '../share/string-util.js';

class Field {
  constructor() {
    var displayName;
    Object.defineProperty(this, 'displayName', {
      get: () => displayName,
      set: value => {
        displayName = value;
        if (displayName) this.propertyName = camelCase(displayName);
      },
      enumerable: true
    });
  }
}

export default Field;
