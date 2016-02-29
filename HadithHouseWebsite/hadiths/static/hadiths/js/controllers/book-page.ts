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

  export class BookPageCtrl extends EntityPageCtrl<IBook> {
    oldBook:IBook;
    BookResource:Services.IBookResource;

    constructor($scope:ng.IScope,
                $rootScope:ng.IScope,
                $location:ng.ILocationService,
                $routeParams:any,
                BookResource:Services.IBookResource,
                ToastService:any) {
      // Setting BookResource before calling super, because super might end up
      // calling methods which requires BookResource, e.g. newEntity().
      this.BookResource = BookResource;
      this.oldBook = new this.BookResource({ });
      super($scope, $rootScope, $location, $routeParams, BookResource, ToastService);
    }

    /**
     * Makes a copy of the data of the book in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyEntity() {
      this.oldBook.title = this.entity.title;
      this.oldBook.brief_desc = this.entity.brief_desc;
      this.oldBook.pub_year = this.entity.pub_year;
    }

    /**
     * Restores the saved data of the book after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreEntity() {
      this.entity.title = this.oldBook.title;
      this.entity.brief_desc = this.oldBook.brief_desc;
      this.entity.pub_year = this.oldBook.pub_year;
    }

    protected newEntity() : IBook {
      return new this.BookResource({
        title: '',
        brief_desc: '',
        pub_year: null
      });
    }

    protected getEntityPath(id: number) {
      return 'book/' + id;
    }
  }

  HadithHouse.HadithHouseApp.controller('BookPageCtrl',
    function ($scope, $rootScope, $location, $routeParams, BookResource, ToastService) {
      return new BookPageCtrl($scope, $rootScope, $location, $routeParams, BookResource, ToastService);
    });
}
