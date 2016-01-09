(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('BooksCtrl',
    function ($scope, $rootScope, $mdDialog, BooksService, ToastService) {
      var ctrl = this;

      $scope.$watch(function () { return $rootScope.user; }, function () {
        ctrl.user = $rootScope.user;
      });

      ctrl.loadBooks = function() {
        BooksService.getBooks().then(function onSuccess(books) {
          ctrl.books = books;
        }, function onError() {
          // TODO: Show an alert.
        });
      };
      ctrl.loadBooks();

      ctrl.deleteBook = function (event, book) {
        var confirm = $mdDialog.confirm()
          .title('Confirm')
          .content('Are you sure you want to delete this book?')
          .ok('Yes')
          .cancel('No')
          .targetEvent(event);
        $mdDialog.show(confirm).then(function () {
          BooksService.deleteBook(book.id).then(function onSuccess() {
            ToastService.show('Book deleted');
            ctrl.loadBooks();
          }, function onError(result) {
            if (result.data) {
              ToastService.showDjangoError("Failed to delete book.", result.data);
            } else {
              ToastService.show("Failed to delete book. Please try again!");
            }
          });
        });
      };
    });
}());