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
import angular, {ILocationService, IScope} from "angular";

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
import {
  IBookResource,
  IBookResourceClass, IChainResource, IChainResourceClass, IHadithResource, IHadithResourceClass, IHadithTagResource,
  IHadithTagResourceClass,
  IPersonResource,
  IPersonResourceClass, IUserResource,
  IUserResourceClass
} from "services/services";

declare function getHtmlBasePath(): String;

declare function fbFetchedLoginStatus(): boolean;

declare function getFbAccessToken(): String;

declare function setFbAccessToken(token: String);

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
HadithHouseApp.factory('HadithResourceClass', ($resource: angular.resource.IResourceService): IHadithResourceClass => {
  return <IHadithResourceClass>$resource<IHadithResource, IHadithResourceClass>('/apis/hadiths/:id', {id: '@id'}, resourceParseConfig);
});
HadithHouseApp.factory('PersonResourceClass', ($resource: angular.resource.IResourceService): IPersonResourceClass => {
  return <IPersonResourceClass>$resource<IPersonResource, IPersonResourceClass>('/apis/persons/:id?id=:ids', {id: '@id'}, resourceParseConfig);
});
HadithHouseApp.factory('BookResourceClass', ($resource: angular.resource.IResourceService): IBookResourceClass => {
  return <IBookResourceClass>$resource<IBookResource, IBookResourceClass>('/apis/books/:id', {id: '@id'}, resourceParseConfig);
});
HadithHouseApp.factory('HadithTagResourceClass', ($resource: angular.resource.IResourceService): IHadithTagResourceClass => {
  return <IHadithTagResourceClass>$resource<IHadithTagResource, IHadithTagResourceClass>('/apis/hadithtags/:id', {id: '@id'}, resourceParseConfig);
});
HadithHouseApp.factory('ChainResourceClass', ($resource: angular.resource.IResourceService): IChainResourceClass => {
  return <IChainResourceClass>$resource<IChainResource, IChainResourceClass>('/apis/chains/:id', {id: '@id'}, resourceParseConfig);
});
HadithHouseApp.factory('UserResourceClass', ($resource: angular.resource.IResourceService): IUserResourceClass => {
  return <IUserResourceClass>$resource<IUserResource, IUserResourceClass>('/apis/users/:id', {id: '@id'}, resourceParseConfig);
});

HadithHouseApp.controller('HadithHouseCtrl',
  function ($scope: IScope,
            $rootScope: any,
            $location: ILocationService,
            FacebookService: FacebookService,
            UserResourceClass: IUserResourceClass) {
    let ctrl = this;

    $rootScope.fetchedLoginStatus = fbFetchedLoginStatus;
    $rootScope.fbUser = null;
    $rootScope.fbAccessToken = getFbAccessToken();

    ctrl.fbLogin = function () {
      FacebookService.login().then(function (response) {
        if (response.status === 'connected') {
          $rootScope.fbAccessToken = response.authResponse.accessToken;
          setFbAccessToken(response.authResponse.accessToken);
          ctrl.getUserInfo();
        }
      });
    };

    ctrl.fbLogout = function () {
      FacebookService.logout().then(function (/*response*/) {
        $rootScope.fbUser = null;
        $rootScope.fbAccessToken = null;
      });
    };

    ctrl.getUserInfo = function () {
      FacebookService.getLoggedInUser().then(function (user) {
        $rootScope.fetchedLoginStatus = true;
        if (user === null) {
          $rootScope.fbUser = null;
        } else {
          $rootScope.fbUser = {
            id: user.id,
            link: user.link,
            profilePicUrl: user.picture.data.url
          };
        }
      }, function onError(/*reason*/) {
        toastr.error('Failed to fetch logged in user.');
      });
      UserResourceClass.get({id: 'current'}, function onSuccess(user) {
        let perms = {};
        for (let i in user.permissions) {
          if (user.permissions.hasOwnProperty(i)) {
            perms[user.permissions[i]] = true;
          }
        }
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

