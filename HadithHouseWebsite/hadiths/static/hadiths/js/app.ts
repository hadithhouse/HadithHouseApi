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

import toastr from "toastr";
import angular, {
  IHttpService,
  IQService,
  IScope,
  IRequestConfig
} from "angular";

import { HomePageCtrlCreator } from "controllers/home-page";
import { HadithListingPageCtrlCreator } from "controllers/hadith-listing-page";
import { HadithPageCtrlCreator } from "controllers/hadith-page";
import { BookListingPageCtrlCreator } from "controllers/book-listing-page";
import { BookPageCtrlCreator } from "controllers/book-page";
import { PersonListingPageCtrlCreator } from "controllers/person-listing-page";
import { PersonPageCtrlCreator } from "controllers/person-page";
import { HadithTagListingPageCtrlCreator } from "controllers/hadithtag-listing-page";
import { HadithTagPageCtrlCreator } from "controllers/hadithtag-page";
import { UserListingPageCtrlCreator } from "controllers/user-listing-page";
import { UserPageCtrlCreator } from "controllers/user-page";
import { FacebookService } from "services/facebook.service";
import "directives/entity.directive";
import "directives/entity-lookup.directive";
import "directives/hadith-listing.directive";
import "directives/selector.directive";
import "directives/tags-input.directive";
import "directives/tree.directive";
import {
  Book, BookResource,
  CacheableResource,
  Chain, ChainResource,
  Hadith, HadithResource,
  HadithTag, HadithTagResource,
  Person, PersonResource,
  User, UserResource
} from "./resources/resources";
import { HadithHouseCtrl } from "./controllers/hadith-house";
import { getApp } from "./app-def";

declare function getHtmlBasePath(): string;

interface IHadithHouseRootScope extends IScope {
  pendingRequests: number;
  fbAccessToken: string;
  fbUser: any;
}

getApp().config(($httpProvider: angular.IHttpProvider,
                 $routeProvider: any,
                 $locationProvider: angular.ILocationProvider) => {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $routeProvider.when("/", {
    templateUrl: getHtmlBasePath() + "home-page.html",
    controller: HomePageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/hadiths", {
    templateUrl: getHtmlBasePath() + "hadiths.html",
    controller: HadithListingPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/hadith/:id", {
    templateUrl: getHtmlBasePath() + "hadith.html",
    controller: HadithPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/books", {
    templateUrl: getHtmlBasePath() + "books.html",
    controller: BookListingPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/book/:id", {
    templateUrl: getHtmlBasePath() + "book.html",
    controller: BookPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/persons", {
    templateUrl: getHtmlBasePath() + "persons.html",
    controller: PersonListingPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/person/:id", {
    templateUrl: getHtmlBasePath() + "person.html",
    controller: PersonPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/hadithtags", {
    templateUrl: getHtmlBasePath() + "hadithtags.html",
    controller: HadithTagListingPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/hadithtag/:id", {
    templateUrl: getHtmlBasePath() + "hadithtag.html",
    controller: HadithTagPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/users", {
    templateUrl: getHtmlBasePath() + "users.html",
    controller: UserListingPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).when("/user/:id", {
    templateUrl: getHtmlBasePath() + "user.html",
    controller: UserPageCtrlCreator,
    controllerAs: "ctrl",
    reloadOnSearch: false
  }).otherwise({redirectTo: "/"});

  $httpProvider.interceptors.push(["$q", "$rootScope",
    ($q: angular.IQService, $rootScope: IHadithHouseRootScope) => {
      function requestInterceptor(config: IRequestConfig) {
        // To be reviewed, added a custom header to disable loading dialog
        // e.g.: type-aheads
        if (!config.headers.hasOwnProperty("X-global")) {
          $rootScope.pendingRequests += 1;
        }
        // If this is a request to the API, appends Facebook authentication
        // token.
        if (config.url.startsWith("/apis/") &&
          $rootScope.fbAccessToken !== null) {
          config.params = config.params || {};
          config.params.fb_token = $rootScope.fbAccessToken;
        }
        return config || $q.when(config);
      }

      function requestErrorInterceptor(rejection: any) {
        if ($rootScope.pendingRequests >= 1) {
          $rootScope.pendingRequests -= 1;
        }
        return $q.reject(rejection);
      }

      function responseInterceptor(response) {
        if ($rootScope.pendingRequests >= 1) {
          $rootScope.pendingRequests -= 1;
        }
        return response || $q.when(response);
      }

      function responseErrorInterceptor(rejection: any) {
        if ($rootScope.pendingRequests >= 1) {
          $rootScope.pendingRequests -= 1;
        }
        return $q.reject(rejection);
      }

      return {
        request: requestInterceptor,
        requestError: requestErrorInterceptor,
        response: responseInterceptor,
        responseError: responseErrorInterceptor
      };
    }
  ]);
}).run(["$rootScope", ($rootScope) => {
  $rootScope.pendingRequests = 0;
}]);

// In offline mode, FacebookOfflineService should be used instead.
getApp().service({
  FacebookService
});

// Register cacheable resources.
getApp().factory("HadithResource",
  ($http: IHttpService, $q: IQService): HadithResource => {
    return new CacheableResource<Hadith, number | string>(
      Hadith, "/apis/hadiths", $http, $q);
  });
getApp().factory("PersonResource",
  ($http: IHttpService, $q: IQService): PersonResource => {
    return new CacheableResource<Person, number>(
      Person, "/apis/persons", $http, $q);
  });
getApp().factory("BookResource",
  ($http: IHttpService, $q: IQService): BookResource => {
    return new CacheableResource<Book, number>(
      Book, "/apis/books", $http, $q);
  });
getApp().factory("HadithTagResource",
  ($http: IHttpService, $q: IQService): HadithTagResource => {
    return new CacheableResource<HadithTag, number>(
      HadithTag, "/apis/hadithtags", $http, $q);
  });
getApp().factory("ChainResource",
  ($http: IHttpService, $q: IQService): ChainResource => {
    return new CacheableResource<Chain, number>(
      Chain, "/apis/chains", $http, $q);
  });
getApp().factory("UserResource",
  ($http: IHttpService, $q: IQService): UserResource => {
    return new CacheableResource<User, number>(
      User, "/apis/users", $http, $q);
  });


getApp().controller("HadithHouseCtrl", HadithHouseCtrl);

// Set Toastr options.
(() => {
  toastr.options.closeButton = true;
  toastr.options.closeButton = true;
  toastr.options.debug = false;
  toastr.options.newestOnTop = true;
  toastr.options.progressBar = false;
  toastr.options.positionClass = "toast-bottom-full-width";
  toastr.options.preventDuplicates = false;
  toastr.options.showDuration = 300;
  toastr.options.hideDuration = 1000;
  toastr.options.timeOut = 5000;
  toastr.options.extendedTimeOut = 1000;
  toastr.options.showEasing = "swing";
  toastr.options.hideEasing = "linear";
  toastr.options.showMethod = "fadeIn";
  toastr.options.hideMethod = "fadeOut";
})();

