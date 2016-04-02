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
/// <reference path="entity-listing-page.ts" />

  module HadithHouse.Controllers {
    import Hadith = HadithHouse.Resources.Hadith;

    export class HadithListingPageCtrl extends EntityListingPageCtrl<Hadith> {
      tagsFilter:number[];
      constructor($scope:ng.IScope,
                  $rootScope:ng.IScope,
                  $timeout:ng.ITimeoutService,
                  $location:ng.ILocationService,
                  $mdDialog:ng.material.IDialogService,
                  private HadithResource:Resources.CacheableResource<Hadith, number>,
                  ToastService:any) {
        super($scope, $rootScope, $timeout, $location, $mdDialog, HadithResource, ToastService);

        $scope.$watch(() => this.tagsFilter, (newValue, oldValue) => {
          this.loadEntities();
        });
      }

      protected readUrlParams() {
        super.readUrlParams();
        let urlParams = this.$location.search();
        try {
          this.tagsFilter = urlParams['tags'].split(',').map((t) => parseInt(t));
        } catch (e) {
          this.tagsFilter = [];
        }
      }

      protected updateUrlParams() {
        super.updateUrlParams();
        if (this.tagsFilter && this.tagsFilter.length > 0) {
          this.$location.search('tags', this.tagsFilter.join(','));
        } else {
          this.$location.search('tags', null);
        }
      }

      protected getQueryParams():{} {
        var queryParams = super.getQueryParams();
        if (this.tagsFilter && this.tagsFilter.length > 0) {
          queryParams['tags'] = this.tagsFilter.join(',');
        }
        return queryParams;
      }

      protected onHadithTagClicked(hadithTag) {
        this.tagsFilter = [hadithTag.id];
      }
    }

    HadithHouse.HadithHouseApp.controller('HadithListingPageCtrl',
      function ($scope, $rootScope, $timeout, $location, $mdDialog, HadithResource, ToastService) {
        return new HadithListingPageCtrl($scope, $rootScope, $timeout, $location, $mdDialog, HadithResource, ToastService);
      });
  }
