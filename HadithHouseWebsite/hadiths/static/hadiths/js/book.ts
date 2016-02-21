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

module HadithHouse.Controllers {
  export class EntityPageController {
    book:any;
    oldBook:any;
    bookId:any;
    addingNew:boolean;
    isEditing:boolean;

    constructor(private $scope:ng.IScope,
                private $rootScope:ng.IScope,
                private $location:ng.ILocationService,
                private $routeParams:any,
                private BookResource:Services.IBookResource,
                private ToastService:any) {
      this.bookId = this.$routeParams.bookId;
      if (this.bookId === 'new') {
        this.setAddingNewBookMode();
      } else {
        this.setOpeningExitingBookMode();
      }

      this.oldBook = {};
    }

    /**
     * Makes a copy of the data of the book in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    private saveCopyOfBook() {
      this.oldBook.title = this.book.title;
      this.oldBook.brief_desc = this.book.brief_desc;
      this.oldBook.pub_year = this.book.pub_year;
    }

    /**
     * Restores the saved data of the book after the user cancels editing
     * or we fail to send changes to the server.
     */
    private restoreCopyOfBook() {
      this.book.title = this.oldBook.title;
      this.book.brief_desc = this.oldBook.brief_desc;
      this.book.pub_year = this.oldBook.pub_year;
    }

    private setAddingNewBookMode() {
      this.book = new this.BookResource({
        title: '',
        brief_desc: '',
        pub_year: null
      });
      this.addingNew = true;
      this.isEditing = true;
    }

    private setOpeningExitingBookMode() {
      this.book = this.BookResource.get({id: this.bookId});
      this.addingNew = false;
      this.isEditing = false;
    }

    /**
     * Called when the user clicks on the edit icon to start editing the book.
     */
    private startEditing() {
      this.saveCopyOfBook();
      this.isEditing = true;
    }

    /**
     * Called when the user clicks on the save icon to save the changes made.
     */
    private finishEditing() {
      // Send the changes to the server.
      this.book.$save((result) => {
        if (this.addingNew) {
          this.$location.path('book/' + this.book.id);
        }
        // Successfully saved changes. Don't need to do anything.
        this.isEditing = false;
        this.addingNew = false;
        this.ToastService.show("Book added.");
      }, (result) => {
        if (result.data) {
          this.ToastService.showDjangoError("Failed to save changes. Error was: ", result.data);
        } else {
          this.ToastService.show("Failed to save changes. Please try again.");
        }
      });
    };

    /**
     * Called when the user clicks on the X icon to cancel the changes made.
     */
    private cancelEditing() {
      this.isEditing = false;
      this.restoreCopyOfBook();
    };
  }

  HadithHouse.HadithHouseApp.controller('BookCtrl',
    function ($scope, $rootScope, $location, $routeParams, BookResource, ToastService) {
      return new HadithHouse.Controllers.EntityPageController($scope, $rootScope, $location, $routeParams, BookResource, ToastService);
    });
}
