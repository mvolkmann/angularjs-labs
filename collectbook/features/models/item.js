'use strict';
/*jshint esnext: true */

class Item {
  constructor() {
    // Use the current timestamp as the unique id for this object.
    this.id = Date.now();

    // There are no other fixed properties for Item objects.
    // They are dependent on the fields in the associated Book object.
  }
}

export default Item;
