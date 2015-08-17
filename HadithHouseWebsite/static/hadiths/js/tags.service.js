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

  HadithHouseApp.factory('TagsService', function ($http, $q, $mdDialog) {
    var getApiUrl = window['getApiUrl'];

    var cachedTags = null;

    function getTags() {
      var deferred = $q.defer();

      if (cachedTags != null) {
        deferred.resolve(cachedTags);
        return deferred.promise;
      }

      $http.get(getApiUrl() + 'hadithtags/').then(function onSuccess(response) {
        cachedTags = response.data;
        deferred.resolve(cachedTags);
      }, function onError() {
        deferred.reject();

        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title("Error")
            .content("Couldn't load tags! Please try again or refresh the page.")
            .ariaLabel('Error')
            .ok('OK')
        );
      });

      return deferred.promise;
    }

    return {
      getTags: getTags
    };
  });
}());
