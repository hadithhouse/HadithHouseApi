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

import _ from "lodash";
import toastr from "toastr";
import angular, {IHttpService, ILocationService, IQService, IScope} from "angular";

import {HomePageCtrlCreator} from "controllers/home-page";
import {HadithListingPageCtrlCreator} from "controllers/hadith-listing-page";
import {HadithPageCtrlCreator} from "controllers/hadith-page";
import {BookListingPageCtrlCreator} from "controllers/book-listing-page";
import {BookPageCtrlCreator} from "controllers/book-page";
import {PersonListingPageCtrlCreator} from "controllers/person-listing-page";
import {PersonPageCtrlCreator} from "controllers/person-page";
import {HadithTagListingPageCtrlCreator} from "controllers/hadithtag-listing-page";
import {HadithTagPageCtrlCreator} from "controllers/hadithtag-page";
import {UserListingPageCtrlCreator} from "controllers/user-listing-page";
import {UserPageCtrlCreator} from "controllers/user-page";
import {HadithHouseApp} from "app-def";
import "services/facebook.service"; // Necessary to force tsc to import the module.
import {FacebookService} from "services/facebook.service";
import "directives/entity.directive"
import "directives/entity-lookup.directive"
import "directives/hadith-listing.directive"
import "directives/selector.directive"
import "directives/tags-input.directive"
import "directives/tree.directive"
import {Book, CacheableResource, Chain, Hadith, HadithTag, Person, User} from "./resources/resources";

declare function getHtmlBasePath(): string;

declare function isFbLoginStatusFetched(): boolean;

declare function getFbAccessToken(): string;

declare function setFbAccessToken(token: string);

declare function isFbSdkLoaded(): boolean;

HadithHouseApp.config(function ($httpProvider: angular.IHttpProvider,
                                $routeProvider: any,
                                $locationProvider: angular.ILocationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $routeProvider.when('/', {
    templateUrl: getHtmlBasePath() + 'home-page.html',
    controller: HomePageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/hadiths', {
    templateUrl: getHtmlBasePath() + 'hadiths.html',
    controller: HadithListingPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/hadith/:id', {
    templateUrl: getHtmlBasePath() + 'hadith.html',
    controller: HadithPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/books', {
    templateUrl: getHtmlBasePath() + 'books.html',
    controller: BookListingPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/book/:id', {
    templateUrl: getHtmlBasePath() + 'book.html',
    controller: BookPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/persons', {
    templateUrl: getHtmlBasePath() + 'persons.html',
    controller: PersonListingPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/person/:id', {
    templateUrl: getHtmlBasePath() + 'person.html',
    controller: PersonPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/hadithtags', {
    templateUrl: getHtmlBasePath() + 'hadithtags.html',
    controller: HadithTagListingPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/hadithtag/:id', {
    templateUrl: getHtmlBasePath() + 'hadithtag.html',
    controller: HadithTagPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/users', {
    templateUrl: getHtmlBasePath() + 'users.html',
    controller: UserListingPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).when('/user/:id', {
    templateUrl: getHtmlBasePath() + 'user.html',
    controller: UserPageCtrlCreator,
    controllerAs: 'ctrl',
    reloadOnSearch: false
  }).otherwise({redirectTo: '/'});

  $httpProvider.interceptors.push(['$q', '$rootScope', function ($q: angular.IQService, $rootScope: angular.IScope) {
    function requestInterceptor(config: any) {
      // To be reviewed, added a custom header to disable loading dialog e.g.: type-aheads
      if (!config.headers.hasOwnProperty('X-global')) {
        $rootScope['pendingRequests']++;
      }
      // If this is a request to the API, appends Facebook authentication token.
      if (config.url.startsWith('/apis/') && $rootScope['fbAccessToken'] !== null) {
        config.params = config.params || {};
        config.params['fb_token'] = $rootScope['fbAccessToken'];
      }
      return config || $q.when(config);
    }

    function requestErrorInterceptor(rejection: any) {
      if ($rootScope['pendingRequests'] >= 1) {
        $rootScope['pendingRequests']--;
      }
      return $q.reject(rejection);
    }

    function responseInterceptor(response) {
      if ($rootScope['pendingRequests'] >= 1) {
        $rootScope['pendingRequests']--;
      }
      return response || $q.when(response);
    }

    function responseErrorInterceptor(rejection: any) {
      if ($rootScope['pendingRequests'] >= 1) {
        $rootScope['pendingRequests']--;
      }
      return $q.reject(rejection);
    }

    return {
      'request': requestInterceptor,
      'requestError': requestErrorInterceptor,
      'response': responseInterceptor,
      'responseError': responseErrorInterceptor
    };
  }
  ]);
}).run(['$rootScope', function ($rootScope) {
  $rootScope['pendingRequests'] = 0;
}]);

HadithHouseApp.service({
  FacebookService // In offline mode, you should use FacebookOfflineService instead.
});

// Register resource factories.
let resourceParseConfig = {
  'query': {
    method: 'GET',
    isArray: true,
    transformResponse: function (data) {
      return JSON.parse(data).results;
    }
  },
  'pagedQuery': {
    method: 'GET',
    isArray: false,
  }
};

// Register cacheable resources.
HadithHouseApp.factory('HadithResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Hadith, number | string> => {
    return new CacheableResource<Hadith, number | string>(Hadith, '/apis/hadiths', $http, $q);
  });
HadithHouseApp.factory('PersonResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Person, number> => {
    return new CacheableResource<Person, number>(Person, '/apis/persons', $http, $q);
  });
HadithHouseApp.factory('BookResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Book, number> => {
    return new CacheableResource<Book, number>(Book, '/apis/books', $http, $q);
  });
HadithHouseApp.factory('HadithTagResource',
  ($http: IHttpService, $q: IQService): CacheableResource<HadithTag, number> => {
    return new CacheableResource<HadithTag, number>(HadithTag, '/apis/hadithtags', $http, $q);
  });
HadithHouseApp.factory('ChainResource',
  ($http: IHttpService, $q: IQService): CacheableResource<Chain, number> => {
    return new CacheableResource<Chain, number>(Chain, '/apis/chains', $http, $q);
  });
HadithHouseApp.factory('UserResource',
  ($http: IHttpService, $q: IQService): CacheableResource<User, number> => {
    return new CacheableResource<User, number>(User, '/apis/users', $http, $q);
  });

HadithHouseApp.controller('HadithHouseCtrl',
  function ($scope: IScope,
            $rootScope: any,
            $location: ILocationService,
            FacebookService: FacebookService,
            UserResource: CacheableResource<User, number | string>) {
    let ctrl = this;

    $rootScope.isFbLoginStatusFetched = isFbLoginStatusFetched;
    $rootScope.fbUser = null;
    $rootScope.fbAccessToken = getFbAccessToken();

    ctrl.fbLogin = function () {
      if (!isFbSdkLoaded()) {
        toastr.error("Cannot login because Facebook SDK couldn't be loaded. This is most probably due to a plugin " +
          "in your browser, e.g. AdBlocker or Ghostery, blocking requests to social websites. Disable blocking for " +
          "this website and try again.");
        return;
      }
      FacebookService.login().then(function (response) {
        if (response.status === 'connected') {
          $rootScope.fbAccessToken = response.authResponse.accessToken;
          setFbAccessToken(response.authResponse.accessToken);
          ctrl.getUserInfo();
        }
      }, function (reason) {
        console.error('Failed to login to Facebook. Reason: ' + reason)
      });
    };

    ctrl.fbLogout = function () {
      FacebookService.logout().then(function (/*response*/) {
        $rootScope.fbUser = null;
        $rootScope.fbAccessToken = null;
      });
    };

    ctrl.getUserInfo = function () {
      if (!isFbSdkLoaded()) {
        // Facebook SDK couldn't be loaded, so we set the fbUser to null.
        $rootScope.fbUser = null;
        return;
      }
      FacebookService.getLoggedInUser().then(function (user) {
        $rootScope.isFbLoginStatusFetched = true;
        if (user === null) {
          $rootScope.fbUser = null;
        } else {
          $rootScope.fbUser = {
            id: user.id,
            link: user.link,
            profilePicUrl: user.picture.data.url
          };
        }
      }, function onError(reason) {
        console.error("Failed to fetch logged in user. Reason: " + JSON.stringify(reason));
      });
      let currentUser = UserResource.get('current', true);
      currentUser.promise.then(() => {
        let perms = {};
        for (let i in currentUser.permissions) {
          if (currentUser.permissions.hasOwnProperty(i)) {
            perms[currentUser.permissions[i]] = true;
          }
        }
        let user: any = {};
        angular.copy(currentUser, user);
        user.permissions = perms;
        $rootScope.user = user;
      });
    };

    ctrl.getUserInfo();

    ctrl.search = function () {
      toastr.warning('Search is not implemented yet!');
    };

    // Load all registered items
    ctrl.menuItems = [
      {name: 'Hadiths', urlPath: 'hadiths', selected: false},
      {name: 'Books', urlPath: 'books', selected: false},
      {
        name: 'Persons',
        urlPath: 'persons',
        selected: false,
        description: 'This page contains a listing of all the persons added to the database of Hadith House.'
      },
      {name: 'Tags', urlPath: 'hadithtags', selected: false},
      {name: 'Users', urlPath: 'users', selected: false}
    ];

    let path = $location.path() ? $location.path().substr(1) : null;
    if (path) {
      for (let i = 0; i < ctrl.menuItems.length; i++) {
        if (ctrl.menuItems[i].urlPath === path) {
          ctrl.selected = ctrl.menuItems[i];
          break;
        }
      }
    }
    if (!ctrl.selected) {
      ctrl.selected = ctrl.menuItems[0];
    }

    ctrl.selectMenuItem = function (item) {
      _.each(ctrl.menuItems, (i) => i.selected = false);
      ctrl.selected = angular.isNumber(item) ? ctrl.menuItems[item] : item;
      $location.url(ctrl.selected.urlPath);
    };
  });

// Set Tosatr options.
(function () {
  toastr.options.closeButton = true;
  toastr.options.closeButton = true;
  toastr.options.debug = false;
  toastr.options.newestOnTop = true;
  toastr.options.progressBar = false;
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.preventDuplicates = false;
  toastr.options.showDuration = 300;
  toastr.options.hideDuration = 1000;
  toastr.options.timeOut = 5000;
  toastr.options.extendedTimeOut = 1000;
  toastr.options.showEasing = 'swing';
  toastr.options.hideEasing = 'linear';
  toastr.options.showMethod = 'fadeIn';
  toastr.options.hideMethod = 'fadeOut';
})();

