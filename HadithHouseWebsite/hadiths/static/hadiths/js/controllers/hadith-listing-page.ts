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
  Book, BookResource,
  Hadith, HadithResource,
  HadithTag, HadithTagResource,
  Person, PersonResource
} from "resources/resources";
import { EntityListingPageCtrl } from "controllers/entity-listing-page";
import { ILocationService, IScope, ITimeoutService } from "angular";
import { getApp } from "../app-def";

export class HadithListingPageCtrl extends EntityListingPageCtrl<Hadith> {
  private tagsFilter: HadithTag[];
  private booksFilter: Book[];
  private personsFilter: Person[];
  static $inject = ["$scope", "$rootScope", "$timeout", "$location",
    "HadithResource", "HadithTagResource", "BookResource", "PersonResource"];

  constructor($scope: IScope,
              $rootScope: IScope,
              $timeout: ITimeoutService,
              $location: ILocationService,
              private hadithResource: HadithResource,
              private hadithTagResource: HadithTagResource,
              private bookResource: BookResource,
              private personResource: PersonResource) {
    super($scope, $rootScope, $timeout, $location, hadithResource, "hadith");

    $scope.$watch(() => this.tagsFilter, () => {
      this.loadEntities();
    });
    $scope.$watchCollection(() => this.tagsFilter, () => {
      this.loadEntities();
    });
    $scope.$watch(() => this.booksFilter, () => {
      this.loadEntities();
    });
    $scope.$watchCollection(() => this.booksFilter, () => {
      this.loadEntities();
    });
    $scope.$watch(() => this.personsFilter, () => {
      this.loadEntities();
    });
    $scope.$watchCollection(() => this.personsFilter, () => {
      this.loadEntities();
    });
  }

  public onHadithTagClicked(tag) {
    this.tagsFilter = [tag];
  }

  protected readUrlParams() {
    super.readUrlParams();
    const urlParams = this.$location.search();

    try {
      const tags: number[] = urlParams.tags.split(",").map((t) => parseInt(t));
      this.tagsFilter = this.hadithTagResource.get(tags);
    } catch (e) {
      this.tagsFilter = [];
    }

    try {
      const books: number[] = urlParams.book.split(",").map((t) => parseInt(t));
      this.booksFilter = this.bookResource.get(books);
    } catch (e) {
      this.booksFilter = [];
    }

    try {
      const persons: number[] = urlParams.person.split(",")
        .map((t) => parseInt(t));
      this.personsFilter = this.personResource.get(persons);
    } catch (e) {
      this.personsFilter = [];
    }
  }

  protected updateUrlParams() {
    super.updateUrlParams();
    if (this.tagsFilter && this.tagsFilter.length > 0) {
      const tags = this.tagsFilter.map(t => t.id).join(",");
      this.$location.search("tags", tags);
    } else {
      this.$location.search("tags", null);
    }

    if (this.booksFilter && this.booksFilter.length > 0) {
      const books = this.booksFilter.map(t => t.id).join(",");
      // TODO: Why is the book singular but persons below plural? Can we filter
      // hadiths by more than one book? If yes, this should be changed to
      // "boos", otherwise we should probably support it as it can be useful
      // to be able to search hadiths across multiple books.
      this.$location.search("book", books);
    } else {
      this.$location.search("book", null);
    }

    if (this.personsFilter && this.personsFilter.length > 0) {
      const persons = this.personsFilter.map(t => t.id).join(",");
      this.$location.search("persons", persons);
    } else {
      this.$location.search("persons", null);
    }
  }

  protected getQueryParams(): {} {
    const queryParams = super.getQueryParams();
    if (this.tagsFilter && this.tagsFilter.length > 0) {
      queryParams.tags = this.tagsFilter.map(t => t.id).join(",");
    }
    if (this.booksFilter && this.booksFilter.length > 0) {
      queryParams.book = this.booksFilter[0].id;
    }
    if (this.personsFilter && this.personsFilter.length > 0) {
      queryParams.person = this.personsFilter[0].id;
    }
    return queryParams;
  }
}

getApp().controller("HadithListingPageCtrl", HadithListingPageCtrl);
