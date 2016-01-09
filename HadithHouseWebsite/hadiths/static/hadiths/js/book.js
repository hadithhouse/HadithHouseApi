(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('BookCtrl',
    function ($scope, $rootScope, $mdDialog, $location, $routeParams, BooksService, ToastService) {
      var ctrl = this;

      ctrl.error = false;

      $scope.$watch(function () { return $rootScope.user; }, function () {
        ctrl.user = $rootScope.user;
      });

      // Is the user loading an existing book or adding a new one?
      ctrl.bookId = $routeParams.bookId;
      if (ctrl.bookId === 'new') {
        // ...adding new book.
        ctrl.book = {
          title: '',
          brief_desc: '',
          pub_year: null
        };
        ctrl.addingNew = true;
        ctrl.isEditing = true;
      } else {
        // ...loading an existing hadith.
        BooksService.getBook(ctrl.bookId).then(function onSuccess(book) {
          ctrl.book = book;
        }, function onError() {

        });
        ctrl.addingNew = false;
        ctrl.isEditing = false;
      }

      var oldBook = {};

      /**
       * Makes a copy of the data of the book in case we have to restore them
       * if the user cancels editing or we fail to send changes to the server.
       */
      function saveCopyOfBook() {
        oldBook.title = ctrl.book.title;
        oldBook.brief_desc = ctrl.book.brief_desc;
        oldBook.pub_year = ctrl.book.pub_year;
      }

      /**
       * Restores the saved data of the book after the user cancels editing
       * or we fail to send changes to the server.
       */
      function restoreCopyOfBook() {
        ctrl.book.title = oldBook.title;
        ctrl.book.brief_desc = oldBook.brief_desc;
        ctrl.book.pub_year = oldBook.pub_year;
      }

      /**
       * Called when the user clicks on the edit icon to start editing the book.
       */
      ctrl.startEditing = function() {
        saveCopyOfBook();
        ctrl.isEditing = true;
      };

      function addNewBook() {
        // Send the changes to the server.
        BooksService.postBook(ctrl.book).then(function onSuccess(result) {
          ctrl.book = result.data;
          $location.path('book/' + ctrl.book.id);
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ctrl.addingNew = false;
          ToastService.show("Book added.");
        }, function onFail(result) {
          if (result.data) {
            ToastService.showDjangoError("Failed to add book. Error was: ", result.data);
          } else {
            ToastService.show("Failed to add book. Please try again.");
          }
        });
      }

      function saveCurrentBook() {
        // Send the changes to the server.
        BooksService.putBook(ctrl.book).then(function onSuccess() {
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ToastService.show("Changes saved.");
        }, function onFail(result) {
          // Failed to save the changes. Restore the old data and show a toast.
          ctrl.isEditing = false;
          restoreCopyOfBook();
          if (result.data) {
            ToastService.showDjangoError("Failed to save book. Error was: ", result.data);
          } else {
            ToastService.show("Failed to save book. Please try again.");
          }
        });
      }
      /**
       * Called when the user clicks on the save icon to save the changes made.
       */
      ctrl.finishEditing = function() {
        if (ctrl.addingNew) {
          addNewBook();
        } else {
          saveCurrentBook();
        }
      };

      /**
       * Called when the user clicks on the X icon to cancel the changes made.
       */
      ctrl.cancelEditing = function() {
        ctrl.isEditing = false;
      };
    });
}());