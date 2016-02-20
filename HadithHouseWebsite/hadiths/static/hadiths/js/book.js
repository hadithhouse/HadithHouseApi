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
/// <reference path="../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="app.ts" />
/// <reference path="services/services.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var EntityPageController = (function () {
            function EntityPageController($scope, $rootScope, $location, $routeParams, BookResource, ToastService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.BookResource = BookResource;
                this.ToastService = ToastService;
                this.bookId = this.$routeParams.bookId;
                if (this.bookId === 'new') {
                    this.setAddingNewBookMode();
                }
                else {
                    this.setOpeningExitingBookMode();
                }
                this.oldBook = {};
            }
            /**
             * Makes a copy of the data of the book in case we have to restore them
             * if the user cancels editing or we fail to send changes to the server.
             */
            EntityPageController.prototype.saveCopyOfBook = function () {
                this.oldBook.title = this.book.title;
                this.oldBook.brief_desc = this.book.brief_desc;
                this.oldBook.pub_year = this.book.pub_year;
            };
            /**
             * Restores the saved data of the book after the user cancels editing
             * or we fail to send changes to the server.
             */
            EntityPageController.prototype.restoreCopyOfBook = function () {
                this.book.title = this.oldBook.title;
                this.book.brief_desc = this.oldBook.brief_desc;
                this.book.pub_year = this.oldBook.pub_year;
            };
            EntityPageController.prototype.setAddingNewBookMode = function () {
                this.book = new this.BookResource({
                    title: '',
                    brief_desc: '',
                    pub_year: null
                });
                this.addingNew = true;
                this.isEditing = true;
            };
            EntityPageController.prototype.setOpeningExitingBookMode = function () {
                this.book = this.BookResource.get({ id: this.bookId });
                this.addingNew = false;
                this.isEditing = false;
            };
            /**
             * Called when the user clicks on the edit icon to start editing the book.
             */
            EntityPageController.prototype.startEditing = function () {
                this.saveCopyOfBook();
                this.isEditing = true;
            };
            /**
             * Called when the user clicks on the save icon to save the changes made.
             */
            EntityPageController.prototype.finishEditing = function () {
                var _this = this;
                // Send the changes to the server.
                this.book.$save(function (result) {
                    if (_this.addingNew) {
                        _this.$location.path('book/' + _this.book.id);
                    }
                    // Successfully saved changes. Don't need to do anything.
                    _this.isEditing = false;
                    _this.addingNew = false;
                    _this.ToastService.show("Book added.");
                }, function (result) {
                    if (result.data) {
                        _this.ToastService.showDjangoError("Failed to save changes. Error was: ", result.data);
                    }
                    else {
                        _this.ToastService.show("Failed to save changes. Please try again.");
                    }
                });
            };
            ;
            /**
             * Called when the user clicks on the X icon to cancel the changes made.
             */
            EntityPageController.prototype.cancelEditing = function () {
                this.isEditing = false;
                this.restoreCopyOfBook();
            };
            ;
            return EntityPageController;
        })();
        Controllers.EntityPageController = EntityPageController;
        HadithHouse.HadithHouseApp.controller('BookCtrl', function ($scope, $rootScope, $location, $routeParams, BookResource, ToastService) {
            return new HadithHouse.Controllers.EntityPageController($scope, $rootScope, $location, $routeParams, BookResource, ToastService);
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=book.js.map