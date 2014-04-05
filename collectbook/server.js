'use strict';
/*jshint esnext: true */
/*global Promise: false */

import Book from './features/models/book';
import Field from './features/models/field';
import {exists, isDirectory, mkdir, readDir, readObject, rm, rmdir, writeObject}
  from './features/share/fs-promise';

var express = require('express');
var fs = require('fs');
var path = require('path');

var topPath = path.resolve(__dirname + '/..');
var dataPath = topPath + '/data/';

var app = express();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(topPath));

var books = {};

function deleteBook(id) {
  return rmdir(dataPath + id);
}

function deleteItem(bookId, itemId) {
  var itemPath = getBookPath(bookId) + '/' + itemId + '.json';
  return rm(itemPath);
}

/**
 * Gets a JavaScript object descriping a given book.
 */
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

function getBookPath(bookId) {
  return dataPath + bookId;
}

/**
 * Gets an array of objects that contain id and name properties for books,
 * not every property of the books.
 */
function getBooks() {
  return new Promise((resolve, reject) => {
    readDir(dataPath).then(
      filenames => {
        var promises = filenames.map(filename => getBook(filename));
        Promise.all(promises).then(
          // Parens are needed around the object literal
          // so the parser doesn't think that's a block.
          books => resolve(books.map(
            book => ({id: book.id, displayName: book.displayName}))),
          reject);
      },
      reject);
  });
}

function getItem(bookId, fileName) {
  var itemPath = getBookPath(bookId) + '/' + fileName;
  return readObject(itemPath);
}

function getItemPath(bookId, itemId) {
  return getBookPath(bookId) + '/item/' + itemId + '.json';
}

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

function saveBook(book) {
  var bookPath = getBookPath(book.id);
  console.log('server saveBook: bookPath =', bookPath);
  return mkdir(bookPath).then(
    () => writeObject(book, bookPath + '/book.json')
  ).then(
    () => {},
    err => console.err('mkdir error:', err)
  );
}

function saveItem(bookId, item) {
  var itemPath = getBookPath(bookId) + '/' + item.id + '.json';
  return writeObject(item, itemPath);
}

// Deletes a book.
app['delete']('/collectbook/book/:bookId', (req, res) => {
  var bookId = req.params.bookId;
  deleteBook(bookId).then(
    () => res.send(null, 200),
    err => res.send(err, 500));
});

// Deletes an item.
app['delete']('/collectbook/book/:bookId/item/:itemId', (req, res) => {
  var bookId = req.params.bookId;
  var itemId = req.params.itemId;
  deleteItem(bookId, itemId).then(
    () => res.send(null, 200),
    err => res.send(err, 500));
});

// Retrieves all books as a JSON array where the values are
// objects with id and name properties.
app.get('/collectbook/book', (req, res) => {
  getBooks().then(
    //books => res.send(books, 200),
    books => res.send(books, 500), // TODO: Testing server errors
    err => {
      console.error('Error:', err);
      res.send(err, 500);
    }
  );
});

// Retrieves a specific Book object.
app.get('/collectbook/book/:bookId', (req, res) => {
  var bookId = req.params.bookId;
  getBook(bookId).then(
    book => res.send(book, 200),
    err => res.send(err, 500)
  );
});

// Retrieves all items in a given book as a JSON object where
// keys are ids and values are Item objects.
app.get('/collectbook/book/:bookId/item', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.

  getItems(bookId).then(
    items => res.send(items, 200),
    err => res.send(err, 500)
  );
});

// Updates a book.
app.put('/collectbook/book/:bookId', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.
  
  var book = req.body;
  if (book) saveBook(book);
  res.send(null, book ? 200 : 404);
});

// Updates an item.
app.put('/collectbook/book/:bookId/item/:itemId', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.
  var itemId = req.params.itemId;
  // TODO: Verify that the item exists and return 404 if not.
 
  var item = req.item;
  if (item) saveItem(bookId, item);
  res.send(null, item ? 200 : 404);
});

// Creates a book and returns its URL.
app.post('/collectbook/book', (req, res) => {
  var book = req.body;
  saveBook(book);
  res.send('/collectbook/book/' + book.id, 200);
});

// Creates an item and returns its URL.
app.post('/collectbook/book/:bookId/item', (req, res) => {
  var bookId = req.params.bookId;
  // TODO: Verify that the book exists and return 404 if not.

  var item = req.body;
  saveItem(bookId, item);
  res.send(getItemPath(bookId, item.id), 200);
});

var PORT = 3000;
app.listen(PORT);
console.log('listening on', PORT);
