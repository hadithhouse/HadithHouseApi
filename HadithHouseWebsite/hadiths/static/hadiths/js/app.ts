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

/// <reference path="../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../TypeScriptDefs/angularjs/angular-route.d.ts" />

declare function getHtmlBasePath():String;
declare var fbFetchedLoginStatus:boolean;
declare var fbAccessToken:String;

module HadithHouse {
  export let HadithHouseApp = angular.module('HadithHouseApp', ['ngResource', 'ngRoute', 'ngMaterial', 'ngMdIcons']);

  HadithHouseApp.config(function ($httpProvider : ng.IHttpProvider, $routeProvider : ng.route.IRouteProvider) {
    $routeProvider.when('/', {
      templateUrl: getHtmlBasePath() + 'home-page.html',
      controller: 'HomePageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/hadiths', {
      templateUrl: getHtmlBasePath() + 'hadiths.html',
      controller: 'HadithListingPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/hadith/:id', {
      templateUrl: getHtmlBasePath() + 'hadith.html',
      controller: 'HadithPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/books', {
      templateUrl: getHtmlBasePath() + 'books.html',
      controller: 'BookListingPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/book/:id', {
      templateUrl: getHtmlBasePath() + 'book.html',
      controller: 'BookPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/persons', {
      templateUrl: getHtmlBasePath() + 'persons.html',
      controller: 'PersonListingPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/person/:id', {
      templateUrl: getHtmlBasePath() + 'person.html',
      controller: 'PersonPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/hadithtags', {
      templateUrl: getHtmlBasePath() + 'hadithtags.html',
      controller: 'HadithTagListingPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/hadithtag/:id', {
      templateUrl: getHtmlBasePath() + 'hadithtag.html',
      controller: 'HadithTagPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/users', {
      templateUrl: getHtmlBasePath() + 'users.html',
      controller: 'UserListingPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).when('/user/:id', {
      templateUrl: getHtmlBasePath() + 'user.html',
      controller: 'UserPageCtrl',
      controllerAs: 'ctrl',
      reloadOnSearch: false
    }).otherwise({redirectTo:'/'});

    $httpProvider.interceptors.push([
      "$q", "$rootScope", function ($q : ng.IQService, $rootScope : ng.IScope) {
        return {
          'request': function (config : any) {
            //To be reviewed, added a custom header to disable loading dialog e.g.: type-aheads
            if (!config.headers.hasOwnProperty("X-global")) {
              $rootScope['pendingRequests']++;
            }
            // If this is a request to the API, appends Facebook authentication token.
            if (config.url.startsWith('/apis/') && $rootScope['fbAccessToken'] !== null) {
              config.params = config.params || {};
              config.params['fb_token'] = $rootScope['fbAccessToken'];
            }
            return config || $q.when(config);
          },
          'requestError': function (rejection) {
            if ($rootScope['pendingRequests'] >= 1) {
              $rootScope['pendingRequests']--;
            }
            return $q.reject(rejection);
          },
          'response': function (response) {
            if ($rootScope['pendingRequests'] >= 1) {
              $rootScope['pendingRequests']--;
            }
            return response || $q.when(response);
          },
          'responseError': function (rejection) {
            if ($rootScope['pendingRequests'] >= 1) {
              $rootScope['pendingRequests']--;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }).run(['$rootScope', '$mdDialog', function ($rootScope) {
    $rootScope['pendingRequests'] = 0;
  }]);


  HadithHouseApp.controller('HadithHouseCtrl',
    function ($scope, $rootScope, $location, $mdSidenav, FacebookService, UserResourceClass) {
      let ctrl = this;

      $rootScope.fetchedLoginStatus = fbFetchedLoginStatus;
      $rootScope.fbUser = null;
      $rootScope.fbAccessToken = fbAccessToken;

      ctrl.fbLogin = function () {
        FacebookService.login().then(function (response) {
          ctrl.getLoggedInUser();
        });
      };

      ctrl.fbLogout = function () {
        FacebookService.logout().then(function (response) {
          $rootScope.fbUser = null;
          $rootScope.fbAccessToken = null;
        });
      };

      ctrl.getUserInfo = function () {
        FacebookService.getLoggedInUser().then(function (user) {
          $rootScope.fetchedLoginStatus = true;
          $rootScope.fbUser = {
            id: user.id,
            link: user.link,
            profilePicUrl: user.picture.data.url
          };
        });
        UserResourceClass.get({id: 'current'}, function onSuccess(user) {
          let perms = {};
          for (let i in user.permissions) {
            perms[user.permissions[i]] = true;
          }
          user.permissions = perms;
          $rootScope.user = user;
        });
      };

      ctrl.getUserInfo();

      // Load all registered items
      ctrl.menuItems = [
        {name: 'Hadiths', urlPath: 'hadiths'},
        {name: 'Books', urlPath: 'books'},
        {name: 'Persons', urlPath: 'persons'},
        {name: 'Tags', urlPath: 'hadithtags'},
        {name: 'Users', urlPath: 'users'}
      ];

      let path = $location.path() ? $location.path().substr(1) : null;
      if (path) {
        for (let i = 0; i < ctrl.menuItems.length; i++) {
          if (ctrl.menuItems[i].urlPath == path) {
            ctrl.selected = ctrl.menuItems[i];
            break;
          }
        }
      }
      if (!ctrl.selected) {
        ctrl.selected = ctrl.menuItems[0];
      }

      $scope.$on('toggleSideNav', function () {
        toggleItemsList();
      });

      function toggleItemsList() {
        $mdSidenav('left').toggle();
      }

      ctrl.selectMenuItem = function (item) {
        ctrl.selected = angular.isNumber(item) ? ctrl.menuItems[item] : item;
        $location.url(ctrl.selected.urlPath);
        toggleItemsList();
      };

      ctrl.toggleSideNav = function () {
        $scope.$broadcast('toggleSideNav', []);
      };
    });
}

