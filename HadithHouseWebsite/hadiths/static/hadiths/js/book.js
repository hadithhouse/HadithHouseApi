(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('BookCtrl',
    function ($scope, $rootScope, $mdDialog, $location, $routeParams, Book, ToastService) {
      var ctrl = this;

      ctrl.error = false;

      $scope.$watch(function () { return $rootScope.user; }, function () {
        ctrl.user = $rootScope.user;
      });

      // Is the user loading an existing book or adding a new one?
      ctrl.bookId = $routeParams.bookId;
      if (ctrl.bookId === 'new') {
        // ...adding new book.
        ctrl.book = new Book({
          title: '',
          brief_desc: '',
          pub_year: null
        });
        ctrl.addingNew = true;
        ctrl.isEditing = true;
      } else {
        // ...loading an existing hadith.
        ctrl.book = Book.get({id: ctrl.bookId});
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

      /**
       * Called when the user clicks on the save icon to save the changes made.
       */
      ctrl.finishEditing = function() {
        // Send the changes to the server.
        ctrl.book.$save(function onSuccess(result) {
          if (ctrl.addingNew) {
            $location.path('book/' + ctrl.book.id);
          }
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ctrl.addingNew = false;
          ToastService.show("Book added.");
        }, function onFail(result) {
          if (result.data) {
            ToastService.showDjangoError("Failed to save changes. Error was: ", result.data);
          } else {
            ToastService.show("Failed to save changes. Please try again.");
          }
        });
      };

      /**
       * Called when the user clicks on the X icon to cancel the changes made.
       */
      ctrl.cancelEditing = function() {
        ctrl.isEditing = false;
      };
    });
}());