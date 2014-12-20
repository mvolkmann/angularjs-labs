'use strict';
/*jshint esnext: true */
/*global Promise: false */

/**
 * This is an HTTP server built in the Node.js Express module.
 * It manages books and items in books.
 * Each book is represented by a directory under the "data" directory
 * and a JSON file inside that directory.
 * Each item within a book is represented by a JSON file
 * inside the directory of its book.
 */

// ES6 imports
import Book from './features/models/book';
import Field from './features/models/field';

// fs-promise wraps a subset of the functions in the Node.js fs module
// so they use ES6 promises.
import {exists, isDirectory, mkdir, readDir, readObject, rm, rmdir, writeObject}
  from './features/share/fs-promise';

var express = require('express');
var path = require('path');

// __dirname refers to the build directory

// Get the path from which static files will be served.
var topPath = path.resolve(__dirname + '/..');

// Get the path from which data files that
// describe books and items will be read.
var dataPath = topPath + '/data/';

// Create and configure the Express app server.

var app = express();

// Automatically convert JSON request bodies to JavaScript objects.
app.use(express.bodyParser());

// Use request routing that will be configured later
// for requests that do not match static files.
// This is essential for implementing REST services.
app.use(app.router);

// Serve static files from a specified directory.
app.use(express.static(topPath));

// Initiates asynchronously deleting a book and
// returns a promise that is resolved when the operation completes.
function deleteBook(id) {
  return rmdir(dataPath + id);
}

// Initiates asynchronously deleting an item within a given book and
// returns a promise that is resolved when the operation completes.
function deleteItem(bookId, itemId) {
  var itemPath = getBookPath(bookId) + '/' + itemId + '.json';
  return rm(itemPath);
}

// Initiates asynchronously getting a given book and
// returns a promise that is resolved when the operation completes.
function getBook(bookId) {
  return new Promise((resolve, reject) => {
    var dirPath = dataPath + bookId;
    isDirectory(dirPath).then(
      bool => {
        if (!bool) return reject(dirPath + ' is not a directory');
        readObject(dirPath + '/book.json').then(resolve, reject);
      },
      reject);
  });
}

// Gets the file path for the JSON file that represents a given book.
function getBookPath(bookId) {
  return dataPath + bookId;
}

// Initiates asynchronously getting an array containing
// an object for every book that holds only its id and name and
// returns a promise that is resolved when the operation completes.
function getBooks() {
  // TODO: Is there a simpler way to write this?
  return new Promise((resolve, reject) => {
    readDir(dataPath).then(
      filenames => {
        var promises = filenames.map(filename => getBook(filename));
        Promise.all(promises).then(
          // Parens are needed around the object literal
          // so the parser doesn't think that's a block.
          books => resolve(books.map(
            book => {
              return {
                id: book.id,
                displayName: book.displayName //.toUpperCase()
              };
            })),
          reject);
      },
      reject);
  });
}

// Initiates asynchronously getting an item in a book and
// returns a promise that is resolved when the operation completes.
function getItem(bookId, fileName) {
  var itemPath = getBookPath(bookId) + '/' + fileName;
  return readObject(itemPath);
}

// Gets the file path for the JSON file that represents a given item.
function getItemPath(bookId, itemId) {
  return getBookPath(bookId) + '/item/' + itemId + '.json';
}

// Initiates asynchronously getting every item in a given book and
// returns a promise that is resolved when the operation completes.
function getItems(bookId) {
  return new Promise((resolve, reject) => {
    readDir(getBookPath(bookId)).then(
      filenames => {
        filenames = filenames.filter(fn => fn !== 'book.json');
        var promises = filenames.map(filename => getItem(bookId, filename));
        Promise.all(promises).then(
          results => {
            var items = {};
            results.forEach(item => items[item.id] = item);
            resolve(items);
          },
          reject);
      },
      reject);
  });
}

// Initiates asynchronously saving a book and
// returns a promise that is resolved when the operation completes.
function saveBook(book) {
  var bookPath = getBookPath(book.id);
  return mkdir(bookPath).then(
    () => writeObject(book, bookPath + '/book.json')
  );
}

// Initiates asynchronously saving an item within a book and
// returns a promise that is resolved when the operation completes.
function saveItem(bookId, item) {
  var itemPath = getBookPath(bookId) + '/' + item.id + '.json';
  return writeObject(item, itemPath);
}

// HTTP route to delete a book.
app['delete']('/collectbook/book/:bookId', (req, res) => {
  var bookId = req.params.bookId;
  deleteBook(bookId).then(
    () => res.send(null, 200),
    err => res.send(err, 500));
});

// HTTP route to delete an item.
app['delete']('/collectbook/book/:bookId/item/:itemId', (req, res) => {
  var bookId = req.params.bookId;
  var itemId = req.params.itemId;
  deleteItem(bookId, itemId).then(
    () => res.send(null, 200),
    err => res.send(err, 500));
});

// HTTP route to retrieve all books as a JSON array where
// the values are objects with id and name properties.
app.get('/collectbook/book', (req, res) => {
  getBooks().then(
    books => res.send(books, 200),
    err => res.send(err, 500));
});

// HTTP route to retrieve a specific Book object.
app.get('/collectbook/book/:bookId', (req, res) => {
  var bookId = req.params.bookId;
  getBook(bookId).then(
    book => res.send(book, 200),
    err => res.send(err, 500)
  );
});

// HTTP route to retrieve all items in a given book as a JSON object where
// keys are ids and values are Item objects.
app.get('/collectbook/book/:bookId/item', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.

  getItems(bookId).then(
    items => res.send(items, 200),
    err => res.send(err, 500)
  );
});

// HTTP route to update a book.
app.put('/collectbook/book/:bookId', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.
  
  var book = req.body;
  if (book) saveBook(book);
  res.send(null, book ? 200 : 404);
});

// HTTP route to update an item.
app.put('/collectbook/book/:bookId/item/:itemId', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.
  var itemId = req.params.itemId;
  // TODO: Verify that the item exists and return 404 if not.
 
  var item = req.item;
  if (item) saveItem(bookId, item);
  res.send(null, item ? 200 : 404);
});

// HTTP route to create a book and returns its URL.
app.post('/collectbook/book', (req, res) => {
  var book = req.body;
  saveBook(book);
  res.send('/collectbook/book/' + book.id, 200);
});

// HTTP route to create an item and returns its URL.
app.post('/collectbook/book/:bookId/item', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.

  var item = req.body;
  saveItem(bookId, item);
  res.send(getItemPath(bookId, item.id), 200);
});

// HTTP route to retrieve all books as a JSON array where
// the values are objects with id and name properties.
app.get('/shutdown', (req, res) => {
  res.send(null, 204);

  server.close(() => process.exit());

  // The server won't actually shutdown until all connections are destroyed.
  sockets.forEach(socket => socket.destroy());
});

// Start the server listening on a given port
// and let the user know the port.
// Browse localhost:3000.
var PORT = 3000;
var server = app.listen(PORT, function () {
  console.log('listening on port', PORT);
});

// Keep track of all connections so they can be destroyed
// if a request to shutdown this server is received.
var sockets = [];
server.on('connection', socket => sockets.push(socket));
