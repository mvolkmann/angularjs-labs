'use strict';
/*jshint esnext: true */

import {camelCase} from '../share/string-util';

class Book {
  constructor() {
    this.id = Date.now();
    this.fields = [];

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

export default Book;
