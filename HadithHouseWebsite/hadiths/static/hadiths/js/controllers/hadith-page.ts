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
  import IResource = angular.resource.IResource;
  import IHadithResource = HadithHouse.Services.IHadithResource;
  import IChainResource = HadithHouse.Services.IChainResource;
  import IEntityQueryResult = HadithHouse.Services.IEntityQueryResult;

  export class HadithPageCtrl extends EntityPageCtrl<IHadithResource> {
    oldHadith:IHadithResource;
    pagedChains:IEntityQueryResult<IChainResource & IResource<IChainResource>>;
    HadithResourceClass:Services.IHadithResourceClass;
    ChainResourceClass:Services.IChainResourceClass;

    constructor($scope:ng.IScope,
                $rootScope:ng.IScope,
                $location:ng.ILocationService,
                $routeParams:any,
                HadithResourceClass:Services.IHadithResourceClass,
                ChainResourceClass:Services.IChainResourceClass,
                ToastService:any) {
      // Setting HadithResourceClass before calling super, because super might end up
      // calling methods which requires HadithResourceClass, e.g. newEntity().
      this.HadithResourceClass = HadithResourceClass;
      this.ChainResourceClass = ChainResourceClass;
      this.oldHadith = new this.HadithResourceClass({});
      super($scope, $rootScope, $location, $routeParams, HadithResourceClass, ToastService);
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

    protected newEntity() : IHadithResource {
      return new this.HadithResourceClass({});
    }

    protected getEntityPath(id: number) {
      return 'hadith/' + id;
    }

    protected setOpeningExitingBookMode(id:string) {
      super.setOpeningExitingBookMode(id);
      // TODO: Use query() instead, as we always want to get all lists of chains and display them, because
      // I don't think there is going to be a very large number of chains for hadiths.
      this.pagedChains = this.ChainResourceClass.pagedQuery({hadith: id});
    }
  }

  HadithHouse.HadithHouseApp.controller('HadithPageCtrl',
    function ($scope, $rootScope, $location, $routeParams, HadithResourceClass, ChainResourceClass, ToastService) {
      return new HadithPageCtrl($scope, $rootScope, $location, $routeParams, HadithResourceClass, ChainResourceClass, ToastService);
    });
}
