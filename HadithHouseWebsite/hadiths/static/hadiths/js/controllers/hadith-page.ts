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
  import IHadith = HadithHouse.Services.IHadith;
  import IHadithResource = HadithHouse.Services.IHadithResource;

  export class HadithPageCtrl extends EntityPageCtrl<IHadith> {
    oldHadith:IHadith;
    HadithResource:Services.IHadithResource;

    constructor($scope:ng.IScope,
                $rootScope:ng.IScope,
                $location:ng.ILocationService,
                $routeParams:any,
                HadithResource:Services.IHadithResource,
                ToastService:any) {
      // Setting HadithResource before calling super, because super might end up
      // calling methods which requires HadithResource, e.g. newEntity().
      this.HadithResource = HadithResource;
      this.oldHadith = new this.HadithResource({});
      super($scope, $rootScope, $location, $routeParams, HadithResource, ToastService);
    }

    /**
     * Makes a copy of the data of the hadith in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyEntity() {
      this.oldHadith.text = this.entity.text;
      this.oldHadith.person = this.entity.person;
      this.oldHadith.book = this.entity.book;
      this.oldHadith.tags = this.entity.tags.slice();
    }

    /**
     * Restores the saved data of the hadith after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreEntity() {
      this.entity.text = this.oldHadith.text;
      this.entity.person = this.oldHadith.person;
      this.entity.book = this.oldHadith.book;
      this.entity.tags = this.oldHadith.tags.slice();
    }

    protected newEntity() : IHadith {
      return new this.HadithResource({});
    }
  }

  HadithHouse.HadithHouseApp.controller('HadithPageCtrl',
    function ($scope, $rootScope, $location, $routeParams, HadithResource, ToastService) {
      return new HadithPageCtrl($scope, $rootScope, $location, $routeParams, HadithResource, ToastService);
    });
}
