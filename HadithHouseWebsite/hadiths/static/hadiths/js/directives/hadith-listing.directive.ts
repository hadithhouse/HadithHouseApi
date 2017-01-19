/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Rafid Khalid Al-Humaimidi
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

/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../resources/resources.ts" />

module HadithHouse.Directives {
  import IScope = angular.IScope;
  import CacheableResource = HadithHouse.Resources.CacheableResource;
  import Hadith = HadithHouse.Resources.Hadith;
  import ObjectWithPromise = HadithHouse.Resources.ObjectWithPromise;
  import PagedResults = HadithHouse.Resources.PagedResults;

  export class HadithListingCtrl {
    public pagedEntities:ObjectWithPromise<PagedResults<Hadith>>;
    public bookId:number;
    public page:number = 1;
    public pageSize:number = 10;

    constructor(private $scope: IScope,
                private $mdDialog:ng.material.IDialogService,
                private HadithResource: CacheableResource<Hadith, number|string>,
                private ToastService:any) {
      $scope.$watch('ctrl.bookId', this.onBookIdChanged);
    }

    public range(n:number):number[] {
      let res:number[] = [];
      for (let i = 0; i < n; i++) {
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

    protected getQueryParams():{} {
      return {
        book: this.bookId,
        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      };
    }

    public deleteEntity = (event:any, entity:Hadith) => {
      let confirm = this.$mdDialog.confirm()
        .title('Confirm')
        .textContent('Are you sure you want to delete the entity?')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      this.$mdDialog.show(confirm).then(() => {
        entity.delete().then(() => {
          this.ToastService.show('Successfully deleted');
          this.pagedEntities.results = this.pagedEntities.results.filter((e) => {
            return e.id !== entity.id;
          });
        }, (result) => {
          if (result.data && result.data.detail) {
            this.ToastService.show('Failed to delete entity. Error was: ' + result.data.detail);
          } else if (result.data) {
            this.ToastService.show('Failed to delete entity. Error was: ' + result.data);
          } else {
            this.ToastService.show('Failed to delete entity. Please try again!');
          }
        });
      });
    };

    private onBookIdChanged = (newId:number, oldId:number) => {
      if (!newId) {
        // TODO: Empty the pagedEntities variable.
        return;
      }

      this.loadEntities();
    }

    private loadEntities() {
      this.pagedEntities = this.HadithResource.pagedQuery(this.getQueryParams());
    }
  }


  HadithHouseApp.controller('HadithListingCtrl',
    ['$scope', '$mdDialog', 'HadithResource', 'ToastService', HadithListingCtrl]);

  // TODO: Consider creating a class for this.
  HadithHouseApp.directive('hhHadithListing', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'directives/hadith-listing.directive.html',
      controller: 'HadithListingCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        bookId: '='
      }
    };
  });
}
