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
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var BookListingPageCtrl = (function () {
            function BookListingPageCtrl($scope, $rootScope, $mdDialog, BookResource, ToastService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$mdDialog = $mdDialog;
                this.BookResource = BookResource;
                this.ToastService = ToastService;
                this.loadBooks();
            }
            BookListingPageCtrl.prototype.loadBooks = function () {
                // TODO: Show an alert if an error happens.
                this.books = this.BookResource.query();
            };
            BookListingPageCtrl.prototype.deleteBook = function (event, book) {
                var confirm = this.$mdDialog.confirm()
                    .title('Confirm')
                    .textContent('Are you sure you want to delete this book?')
                    .ok('Yes')
                    .cancel('No')
                    .targetEvent(event);
                this.$mdDialog.show(confirm).then(function () {
                    this.BookResource.delete({ id: book.id }, function onSuccess() {
                        this.ToastService.show('Book deleted');
                        this.loadBooks();
                    }, function onError(result) {
                        if (result.data && result.data.detail) {
                            this.ToastService.show("Failed to delete person. Error was: " + result.data.detail);
                        }
                        else if (result.data) {
                            this.ToastService.show("Failed to delete book. Error was: " + result.data);
                        }
                        else {
                            this.ToastService.show("Failed to delete book. Please try again!");
                        }
                    });
                });
            };
            return BookListingPageCtrl;
        })();
        Controllers.BookListingPageCtrl = BookListingPageCtrl;
        HadithHouse.HadithHouseApp.controller('BookListingPageCtrl', function ($scope, $rootScope, $mdDialog, BookResource, ToastService) {
            return new BookListingPageCtrl($scope, $rootScope, $mdDialog, BookResource, ToastService);
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=book-listing-page.js.map