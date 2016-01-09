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

function waitForPromises(promises, callback) {
  
}

(function () {
  var HadithHouseApp = angular.module('HadithHouseApp');

  function BookSelectorCtrl($scope, BooksService) {

  }

  HadithHouseApp.controller('BookSelectorCtrl', function ($q, $scope, BooksService) {
    var ctrl = this;

    ctrl.availBooks = [];
    ctrl.availBooksLoaded = false;

    if (!ctrl.booksIds) {
      ctrl.booksIds = [];
    }

    if (!ctrl.books) {
      ctrl.books = [];
    }

    BooksService.getBooks().then(function onSuccess(books) {
      ctrl.availBooksLoaded = true;
      ctrl.availBooks = books;
    });

    function onBooksIdsChanged(newValue, oldValue) {
      if (newValue && oldValue && newValue.toString() === oldValue.toString()) {
        return;
      }
      BooksService.getBooks().then(function() {
        ctrl.books = ctrl.booksIds.map(function (id) {
          return BooksService.getBookSync(id);
        });
      });
    }

    $scope.$watch(function() { return ctrl.booksIds; }, onBooksIdsChanged);
    $scope.$watchCollection(function() { return ctrl.booksIds; }, onBooksIdsChanged);

    function onBooksChanged(newValue, oldValue) {
      if (ctrl.books) {
        // If the control only allows single select, we remove every elements
        // before the last.
        if (ctrl.singleSelect === true && ctrl.books.length > 1) {
          ctrl.books.splice(0, ctrl.books.length - 1);
        }
        ctrl.booksIds = ctrl.books.map(function(book) {
          return book.id;
        });
      }
    }

    $scope.$watch(function() { return ctrl.books; }, onBooksChanged);
    $scope.$watchCollection(function() { return ctrl.books; }, onBooksChanged);

    /*ctrl.onBookChange = function() {
      ctrl.bookId = ctrl.book.id;
    };*/

    ctrl.findBooks = function (query) {
      if (!ctrl.availBooksLoaded) {
        return [];
      }

      return ctrl.availBooks.filter(function (book) {
        return (book.title.indexOf(query) > -1);
      });
    };
  });

  HadithHouseApp.directive('hhBookSelector', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'directives/bookselector.directive.html',
      controller: 'BookSelectorCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        booksIds: '=',
        readOnly: '=',
        singleSelect: '='
      }
    };

  });
}());