/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Rafid Khalid Al-Humaimidi
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

/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="entity-page.ts" />

module HadithHouse.Controllers {
  import IBook = HadithHouse.Services.IBook;
  import IBookResource = HadithHouse.Services.IBookResource;
  import IResourceArray = angular.resource.IResourceArray;

  export class BookListingPageCtrl {
    books:IResourceArray<IBook>;

    constructor(private $scope:ng.IScope,
                private $rootScope:ng.IScope,
                private $mdDialog:ng.material.IDialogService,
                private BookResource:Services.IBookResource,
                private ToastService:any) {

      this.loadBooks();
    }

    private loadBooks() {
      // TODO: Show an alert if an error happens.
      this.books = this.BookResource.query();
    }

    private deleteBook(event : any, book : IBook) {
      var confirm = this.$mdDialog.confirm()
        .title('Confirm')
        .textContent('Are you sure you want to delete this book?')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      this.$mdDialog.show(confirm).then(function () {
        this.BookResource.delete({id: book.id}, function onSuccess() {
          this.ToastService.show('Book deleted');
          this.loadBooks();
        }, function onError(result) {
          if (result.data && result.data.detail) {
            this.ToastService.show("Failed to delete person. Error was: " + result.data.detail);
          } else if (result.data) {
            this.ToastService.show("Failed to delete book. Error was: " + result.data);
          } else {
            this.ToastService.show("Failed to delete book. Please try again!");
          }
        });
      });
    }
  }

  HadithHouse.HadithHouseApp.controller('BookListingPageCtrl',
    function ($scope, $rootScope, $mdDialog, BookResource, ToastService) {
      return new BookListingPageCtrl($scope, $rootScope, $mdDialog, BookResource, ToastService);
    });
}
