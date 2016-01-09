/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Rafid K. Abdullah
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.factory('BooksService', function ($http, $q, $mdDialog, $rootScope) {
    var cachedBooks = null;
    var booksDict = {};
    var booksDictCreated = false;

    // TODO: This function duplicated in the other services as well; consider
    // defining it somewhere else, e.g. $rootScope.
    function getUrl(relativePath) {
      var getApiUrl = window['getApiUrl'];

      var accessToken = $rootScope.fbAccessToken;
      if (accessToken !== null) {
        return getApiUrl() + relativePath + '?fb_token=' + accessToken;
      } else {
        return getApiUrl() + relativePath;
      }
    }

    /**
     * Retrieves the book having the given ID.
     * @param bookId The ID of the book.
     * @returns A promise resolving on success to the required book.
     */
    function getBook(bookId) {
      var deferred = $q.defer();

      if (booksDict[bookId]) {
        deferred.resolve(booksDict[bookId]);
        return deferred.promise;
      }

      $http.get(getUrl('books/' + bookId)).then(function onSuccess(response) {
        var book = response.data;
        deferred.resolve(book);
      }, function onError(reason) {
        deferred.reject(reason);
      });

      return deferred.promise;
    }

    function getBookSync(bookId) {
      if (!booksDictCreated) {
        throw "Books are not loaded yet.";
      }
      return booksDict[bookId] || null;
    }

    function createBooksDict() {
      booksDict = {};
      booksDictCreated = true;
      _.each(cachedBooks, function(book) {
        booksDict[book.id] = book;
      });
    }

    function getBooks() {
      var deferred = $q.defer();

      if (cachedBooks != null) {
        deferred.resolve(cachedBooks);
        return deferred.promise;
      }

      $http.get(getUrl('books/')).then(function onSuccess(response) {
        cachedBooks = response.data;
        createBooksDict();
        deferred.resolve(cachedBooks);
      }, function onError(reason) {
        deferred.reject(reason);

        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title("Error")
            .content("Couldn't load books! Please try again or refresh the page.")
            .ariaLabel('Error')
            .ok('OK')
        );
      });

      return deferred.promise;
    }

    function postBook(book) {
      var d = $http.post(getUrl('books/'), book);
      d.then(function onSuccess(result) {
        var newBook = result.data;
        if (cachedBooks !== null) {
          cachedBooks.push(newBook);
        }
      });
      return d;
    }

    function putBook(book) {
      var d = $http.put(getUrl('books/' + book.id), book);
      d.then(function onSuccess(result) {
        var newBook = result.data;
        if (cachedBooks !== null) {
          for (var i = 0; i < cachedBooks.length; i++) {
            if (cachedBooks[i].id === newBook.id) {
              cachedBooks[i] = newBook;
              break;
            }
          }
        }
      });
      return d;
    }

    function deleteBook(bookId) {
      var d = $http.delete(getUrl('books/' + bookId));
      d.then(function onSuccess(result) {
        var newBook = result.data;
        if (cachedBooks !== null) {
          for (var i = 0; i < cachedBooks.length; i++) {
            if (cachedBooks[i].id === bookId) {
              cachedBooks.splice(i, 1);
              break;
            }
          }
        }
      });
      return d;
    }
    return {
      getBook: getBook,
      getBookSync: getBookSync,
      getBooks: getBooks,
      postBook: postBook,
      putBook: putBook,
      deleteBook: deleteBook
    };
  });
}());

