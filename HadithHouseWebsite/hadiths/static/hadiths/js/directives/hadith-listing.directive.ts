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
import {CacheableResource, Hadith, ObjectWithPromise, PagedResults} from "../resources/resources";
import {IScope} from "angular";
import {getHtmlBasePath, HadithHouseApp} from "../app";

export class HadithListingCtrl {
  public pagedEntities: ObjectWithPromise<PagedResults<Hadith>>;
  public bookId: number;
  public page: number = 1;
  public pageSize: number = 10;

  constructor(private $scope: IScope,
              private HadithResource: CacheableResource<Hadith, number|string>) {
    $scope.$watch('ctrl.bookId', this.onBookIdChanged);
    $scope.$watch('ctrl.page', this.onPageChanged);
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

  protected getQueryParams(): {} {
    return {
      book: this.bookId,
      limit: this.pageSize,
      offset: (this.page - 1) * this.pageSize
    };
  }

  public deleteEntity = (event: any, entity: Hadith) => {
    // FIXME: Use Bootstrap dialog.
    /*let confirm = this.$mdDialog.confirm()
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
     });*/
  };

  private onPageChanged = (newPage: number, oldPage: number) => {
    if (!newPage) {
      return;
    }
    this.loadEntities();
  };

  private onBookIdChanged = (newId: number, oldId: number) => {
    if (!newId) {
      // TODO: Empty the pagedEntities variable.
      return;
    }

    this.loadEntities();
  };

  private loadEntities() {
    this.pagedEntities = this.HadithResource.pagedQuery(this.getQueryParams());
  }
}


HadithHouseApp.controller('HadithListingCtrl', ['$scope', 'HadithResource', HadithListingCtrl]);

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
