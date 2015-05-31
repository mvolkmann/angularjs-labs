'use strict';
/*jshint esnext: true */

import {camelCase} from '../share/string-util.js';

class Book {
  constructor() {
    // Use the current timestamp as the unique id for this object.
    this.id = Date.now();

    this.fields = [];

    // Provide a place to store the "displayName" property value
    // that is available in the get/set methods below through closure.
    var displayName;

    // Define getter and setter methods for the "displayName" property
    // so that the "propertyName" property can be automatically set
    // whenever the "displayName" property is set.
    Object.defineProperty(this, 'displayName', {
      get: () => displayName,
      set: value => {
        displayName = value;
        this.propertyName = displayName ? camelCase(displayName): null;
      },
      enumerable: true
    });
  }
}

export default Book;
