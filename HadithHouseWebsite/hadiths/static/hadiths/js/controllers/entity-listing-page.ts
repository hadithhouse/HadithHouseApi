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
/// <reference path="../../../../../TypeScriptDefs/bootstrap/bootstrap.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../resources/resources.ts" />
/// <reference path="entity-page.ts" />

module HadithHouse.Controllers {
  import IPromise = angular.IPromise;
  import Entity = HadithHouse.Resources.Entity;
  import PagedResults = HadithHouse.Resources.PagedResults;
  import ObjectWithPromise = HadithHouse.Resources.ObjectWithPromise;

  export class EntityListingPageCtrl<TEntity extends Entity<number|string>> {
    public pagedEntities:ObjectWithPromise<PagedResults<TEntity>>;
    public searchQuery:string;
    public searchPromise:IPromise<void> = null;
    public page:number = 1;
    public pageSize:number = 10;
    public entityToDelete:TEntity;


    constructor(protected $scope:ng.IScope,
                protected $rootScope:any, // TODO: Avoid using type 'any'.
                protected $timeout:ng.ITimeoutService,
                protected $location:ng.ILocationService,
                protected EntityResource:Resources.CacheableResource<TEntity, number|string>,
                protected type:string) {
      this.readUrlParams();
      this.loadEntities();

      $scope.$watch(() => this.searchQuery, (newValue, oldValue) => {
        if (newValue === oldValue) {
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
        if (newValue === oldValue) {
          return;
        }
        this.loadEntities();
      });
    }

    protected readUrlParams() {
      let urlParams = this.$location.search();
      this.page = parseInt(urlParams['page']) || 1;
      this.searchQuery = urlParams['search'] || '';
    }

    protected updateUrlParams() {
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

    protected getQueryParams():{} {
      if (!this.searchQuery) {
        return {
          limit: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        };
      } else {
        return {
          search: this.searchQuery,
          limit: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        };
      }
    }

    protected loadEntities() {
      // TODO: Show an alert if an error happens.
      this.pagedEntities = this.EntityResource.pagedQuery(this.getQueryParams());
      this.updateUrlParams();
    }

    public showDeleteDialog = (entity:TEntity) => {
      this.entityToDelete = entity;
      $('#deleteConfirmDialog').modal('show');
    };

    public deleteEntity = () => {
      $('#deleteConfirmDialog').modal('hide');
      this.entityToDelete.delete().then(() => {
        toastr.success('Entity deleted');
        this.pagedEntities.results = this.pagedEntities.results.filter((e) => {
          return e.id !== this.entityToDelete.id;
        });
        this.entityToDelete = null;
      }, (result) => {
        if (result.data && result.data.detail) {
          toastr.error('Failed to delete entity. Error was: ' + result.data.detail);
        } else if (result.data) {
          toastr.error('Failed to delete entity. Error was: ' + result.data);
        } else {
          toastr.error('Failed to delete entity. Please try again!');
        }
      });
    }

    public userHasAddPermission():boolean {
      if (this.$rootScope.user) {
        return this.$rootScope.user.permissions['add_' + this.type];
      }
      return false;
    }

    public userHasDeletePermission():boolean {
      if (this.$rootScope.user) {
        return this.$rootScope.user.permissions['delete_' + this.type];
      }
      return false;
    }

    public pageRange(): number[] {
      let res: number[] = [];
      let start = Math.max(this.page - 3, 0);
      let end = Math.min(start + 4, this.getPageCount() - 1);
      for (let i = start; i <= end; i++) {
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

    public setPage(page: number) {
      this.page = page;
      if (this.page < 1) {
        this.page = 1;
      }
      if (this.page > this.getPageCount()) {
        this.page = this.getPageCount();
      }
    }

    public isFirstPage(): boolean {
      return this.page <= 1;
    }

    public isLastPage(): boolean {
      return this.page >= this.getPageCount();
    }
  }
}
