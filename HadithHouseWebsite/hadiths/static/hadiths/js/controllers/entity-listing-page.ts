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
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../resources/resources.ts" />
/// <reference path="entity-page.ts" />

module HadithHouse.Controllers {
  import IPromise = angular.IPromise;
  import IEntityQueryResult = HadithHouse.Services.IEntityQueryResult;
  import Entity = HadithHouse.Resources.Entity;
  import PagedResults = HadithHouse.Resources.PagedResults;
  import Chain = HadithHouse.Resources.Chain;
  import Person = HadithHouse.Resources.Person;
  import ObjectWithPromise = HadithHouse.Resources.ObjectWithPromise;

  export class EntityListingPageCtrl<TEntity extends Entity> {
    pagedEntities:ObjectWithPromise<PagedResults<TEntity>>;
    searchQuery:string;
    searchPromise:IPromise<void> = null;
    page:number = 1;
    pageSize:number = 10;

    constructor(private $scope:ng.IScope,
                private $rootScope:ng.IScope,
                private $timeout:ng.ITimeoutService,
                private $location:ng.ILocationService,
                private $mdDialog:ng.material.IDialogService,
                private EntityResource:Resources.CacheableResource<TEntity>,
                private ToastService:any) {
      let urlParams = $location.search();
      this.page = parseInt(urlParams['page']) || 1;
      this.searchQuery = urlParams['search'] || '';

      this.loadEntities();

      $scope.$watch(() => this.searchQuery, (newValue, oldValue) => {
        if (newValue == oldValue) {
          return;
        }
        if (this.searchPromise != null) {
          $timeout.cancel(this.searchPromise);
        }
        this.page = 1;
        this.searchPromise = $timeout(() => {
          this.loadEntities();
        }, 250);
      });

      $scope.$watch(() => this.page, (newValue, oldValue) => {
        if (newValue == oldValue) {
          return;
        }
        this.loadEntities();
      });
    }

    private loadEntities() {
      // TODO: Show an alert if an error happens.
      if (!this.searchQuery) {
        this.pagedEntities = this.EntityResource.pagedQuery({
          limit: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        });
      } else {
        this.pagedEntities = this.EntityResource.pagedQuery({
          search: this.searchQuery,
          limit: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        });
      }
      if (typeof(this.page) === 'number' && this.page > 1) {
        this.$location.search('page', this.page);
      } else {
        this.$location.search('page', null);
      }
      if (this.searchQuery) {
        this.$location.search('search', this.searchQuery);
      } else {
        this.$location.search('search', null);
      }
    }

    public deleteEntity = (event:any, entity:TEntity) => {
      var confirm = this.$mdDialog.confirm()
        .title('Confirm')
        .textContent('Are you sure you want to delete the entity?')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      this.$mdDialog.show(confirm).then(() => {
        entity.delete().then(() => {
          this.ToastService.show('Successfully deleted');
          this.pagedEntities.results = this.pagedEntities.results.filter((e) => {
            return e.id != entity.id;
          });
        }, (result) => {
          if (result.data && result.data.detail) {
            this.ToastService.show("Failed to delete entity. Error was: " + result.data.detail);
          } else if (result.data) {
            this.ToastService.show("Failed to delete entity. Error was: " + result.data);
          } else {
            this.ToastService.show("Failed to delete entity. Please try again!");
          }
        });
      });
    }

    public range(n:number):number[] {
      let res:number[] = [];
      for (var i = 0; i < n; i++) {
        res.push(i + 1);
      }
      return res;
    }

    public getPageCount() {
      if (this.pagedEntities) {
        return Math.ceil(this.pagedEntities.count / this.pageSize);
      }
      return 0;
    }

    public setPage(index:number) {
      this.page = index;
    }
  }
}
