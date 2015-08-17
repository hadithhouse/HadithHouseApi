/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Rafid K. Abdullah
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

(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp', ['ngRoute', 'ngMaterial', 'ngMdIcons']);

  HadithHouseApp.config(function ($routeProvider, $mdThemingProvider/*, $mdIconProvider*/) {
    /*$mdIconProvider
     .defaultIconSet("/static/hadiths/svg/avatars.svg", 128)
     .icon("menu", "/static/hadiths/svg/menu.svg", 24)
     .icon("share", "/static/hadiths/svg/share.svg", 24)
     .icon("google_plus", "/static/hadiths/svg/google_plus.svg", 512)
     .icon("hangouts", "/static/hadiths/svg/hangouts.svg", 512)
     .icon("twitter", "/static/hadiths/svg/twitter.svg", 512)
     .icon("phone", "/static/hadiths/svg/phone.svg", 512);*/

    $mdThemingProvider.theme('default')
      .primaryPalette('brown')
      .accentPalette('red');

    $routeProvider.when('/hadiths', {
      templateUrl: getHtmlBasePath() + 'hadiths.html',
      controller: 'HadithsCtrl',
      controllerAs: 'ctrl',
    }).when('/tags', {
      templateUrl: getHtmlBasePath() + 'tags.html',
      controller: 'TagsCtrl',
      controllerAs: 'ctrl',
    });
  });

  HadithHouseApp.controller('HadithHouseCtrl',
    function ($scope, $location, $mdSidenav) {
      var ctrl = this;

      // Load all registered items
      ctrl.items = [
        {name: 'Hadiths', urlPath: 'hadiths'},
        {name: 'Persons', urlPath: 'persons'},
        {name: 'Tags', urlPath: 'tags'}
      ];

      var path = $location.path() ? $location.path().substr(1) : null;
      if (path) {
        for (var i = 0; i < ctrl.items.length; i++) {
          if (ctrl.items[i].urlPath == path) {
            ctrl.selected = ctrl.items[i];
            break;
          }
        }
      }
      if (!ctrl.selected) {
        ctrl.selected = ctrl.items[0];
      }

      $scope.$on('toggleSideNav', function () {
        toggleItemsList();
      });

      function toggleItemsList() {
        $mdSidenav('left').toggle();
      }

      ctrl.selectItem = function (item) {
        ctrl.selected = angular.isNumber(item) ? $scope.items[item] : item;
        $location.path(ctrl.selected.urlPath);
        toggleItemsList();
      };

      ctrl.toggleSideNav = function () {
        $scope.$broadcast('toggleSideNav', []);
      };
    });


}());
