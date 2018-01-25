/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Rafid Khalid Al-Humaimidi
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

import {
  Book,
  CacheableResource,
  Hadith,
  HadithTag,
  Person
} from "resources/resources";
import { EntityListingPageCtrl } from "controllers/entity-listing-page";
import { ILocationService, IScope, ITimeoutService } from "angular";
import { getApp } from "../app-def";

export class HadithListingPageCtrl extends EntityListingPageCtrl<Hadith> {
  private tagsFilter: HadithTag[];
  private booksFilter: Book[];
  private personsFilter: Person[];

  constructor($scope: IScope,
              $rootScope: IScope,
              $timeout: ITimeoutService,
              $location: ILocationService,
              private HadithResource: CacheableResource<Hadith, number | string>,
              private HadithTagResource: CacheableResource<HadithTag, number>,
              private BookResource: CacheableResource<Book, number>,
              private PersonResource: CacheableResource<Person, number>) {
    super($scope, $rootScope, $timeout, $location, HadithResource, 'hadith');

    $scope.$watch(() => this.tagsFilter, (newValue, oldValue) => {
      this.loadEntities();
    });
    $scope.$watchCollection(() => this.tagsFilter, (newValue, oldValue) => {
      this.loadEntities();
    });

    $scope.$watch(() => this.booksFilter, (newValue, oldValue) => {
      this.loadEntities();
    });
    $scope.$watchCollection(() => this.booksFilter, (newValue, oldValue) => {
      this.loadEntities();
    });

    $scope.$watch(() => this.personsFilter, (newValue, oldValue) => {
      this.loadEntities();
    });
    $scope.$watchCollection(() => this.personsFilter, (newValue, oldValue) => {
      this.loadEntities();
    });
  }

  public onHadithTagClicked(tag) {
    this.tagsFilter = [tag];
  }

  protected readUrlParams() {
    super.readUrlParams();
    let urlParams = this.$location.search();

    try {
      let tagIds: number[] = urlParams['tags'].split(',').map((t) => parseInt(t));
      this.tagsFilter = this.HadithTagResource.get(tagIds);
    } catch (e) {
      this.tagsFilter = [];
    }

    try {
      let bookIds: number[] = urlParams['book'].split(',').map((t) => parseInt(t));
      this.booksFilter = this.BookResource.get(bookIds);
    } catch (e) {
      this.booksFilter = [];
    }

    try {
      let personIds: number[] = urlParams['person'].split(',').map((t) => parseInt(t));
      this.personsFilter = this.PersonResource.get(personIds);
    } catch (e) {
      this.personsFilter = [];
    }
  }

  protected updateUrlParams() {
    super.updateUrlParams();
    if (this.tagsFilter && this.tagsFilter.length > 0) {
      this.$location.search('tags', this.tagsFilter.map(t => t.id).join(','));
    } else {
      this.$location.search('tags', null);
    }

    if (this.booksFilter && this.booksFilter.length > 0) {
      this.$location.search('book', this.booksFilter.map(t => t.id).join(','));
    } else {
      this.$location.search('book', null);
    }

    if (this.personsFilter && this.personsFilter.length > 0) {
      this.$location.search('persons', this.personsFilter.map(t => t.id).join(','));
    } else {
      this.$location.search('persons', null);
    }
  }

  protected getQueryParams(): {} {
    let queryParams = super.getQueryParams();
    if (this.tagsFilter && this.tagsFilter.length > 0) {
      queryParams['tags'] = this.tagsFilter.map(t => t.id).join(',');
    }
    if (this.booksFilter && this.booksFilter.length > 0) {
      queryParams['book'] = this.booksFilter[0].id;
    }
    if (this.personsFilter && this.personsFilter.length > 0) {
      queryParams['person'] = this.personsFilter[0].id;
    }
    return queryParams;
  }
}

export function HadithListingPageCtrlCreator($scope, $rootScope, $timeout, $location, HadithResource,
                                             HadithTagResource, BookResource, PersonResource) {
  return new HadithListingPageCtrl($scope, $rootScope, $timeout, $location, HadithResource, HadithTagResource,
    BookResource, PersonResource);
}

getApp().controller('HadithListingPageCtrl', HadithListingPageCtrlCreator);
