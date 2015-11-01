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

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.factory('UsersService', function ($http, $q, $mdDialog, $rootScope) {
    var cachedPermissions = null;

    // TODO: This function duplicated in the other services as well; consider
    // defining it somewhere else, e.g. $rootScope.
    function getUrl(relativePath) {
      var getApiUrl = window['getApiUrl'];

      var accessToken = $rootScope.fbAccessToken;
      if (accessToken !== null) {
        return getApiUrl() + relativePath + '?fb_token=' + accessToken;
      } else {
        return getApiUrl() + relativePath;
      }
    }

    function getPermissions(refreshCache) {
      var deferred = $q.defer();

      if (cachedPermissions != null && refreshCache !== true) {
        deferred.resolve(cachedPermissions);
        return deferred.promise;
      }

      $http.get(getUrl('hadithtags/')).then(function onSuccess(response) {
        cachedPermissions = response.data;
        deferred.resolve(cachedPermissions);
      }, function onError() {
        deferred.reject();

        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title("Error")
            .content("Couldn't load permissions! Please try again or refresh the page.")
            .ariaLabel('Error')
            .ok('OK')
        );
      });

      return deferred.promise;
    }

    return {
      getPermissions: getPermissions
    };
  });
}());
