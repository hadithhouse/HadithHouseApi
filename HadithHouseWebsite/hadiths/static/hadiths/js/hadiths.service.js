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

  HadithHouseApp.factory('HadithsService', function ($http, $q, $mdDialog) {
    var getApiUrl = window['getApiUrl'];

    var cachedHadiths = null;

    function reloadHadiths() {
      // Remove cached hadiths and sends a request to load hadiths.
      cachedHadiths = null;
      return getHadiths();
    }

    function getHadith(hadithId) {
      var deferred = $q.defer();

      $http.get(getApiUrl() + 'hadiths/' + hadithId).then(function onSuccess(response) {
        var hadith = response.data;
        deferred.resolve(hadith);
      }, function onError() {
        deferred.reject();

        // TODO: We could tell whether the ID Is invalid by checking the detail of the
        // server error.
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title("Error")
            .content("Couldn't load hadith! The ID might be invalid. Otherwire, please try again or refresh the page.")
            .ariaLabel('Error')
            .ok('OK')
        );
      });

      return deferred.promise;
    }

    function getHadiths(refreshCache) {
      var deferred = $q.defer();

      if (cachedHadiths != null && refreshCache !== true) {
        deferred.resolve(cachedHadiths);
        return deferred.promise;
      }

      $http.get(getApiUrl() + 'hadiths/').then(function onSuccess(response) {
        cachedHadiths = response.data;
        deferred.resolve(cachedHadiths);
      }, function onError() {
        deferred.reject();

        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title("Error")
            .content("Couldn't load hadiths! Please try again or refresh the page.")
            .ariaLabel('Error')
            .ok('OK')
        );
      });

      return deferred.promise;
    }

    function postHadith(hadith) {
      var d = $http.post(getApiUrl() + 'hadiths/', hadith);
      d.then(function onSuccess(result) {
        var newHadith = result.data;
        if (cachedHadiths !== null) {
          cachedHadiths.push(newHadith);
        }
      });
      return d;
    }

    function putHadith(hadith) {
      var d = $http.put(getApiUrl() + 'hadiths/' + hadith.id, hadith);
      d.then(function onSuccess(result) {
        var newHadith = result.data;
        if (cachedHadiths !== null) {
          for (var i = 0; i < cachedHadiths.length; i++) {
            if (cachedHadiths[i].id === newHadith.id) {
              cachedHadiths[i] = newHadith;
              break;
            }
          }
        }
      });
      return d;
    }

    function deleteHadith(hadithId) {
      var d = $http.delete(getApiUrl() + 'hadiths/' + hadithId);
      d.then(function onSuccess(result) {
        var newHadith = result.data;
        if (cachedHadiths !== null) {
          for (var i = 0; i < cachedHadiths.length; i++) {
            if (cachedHadiths[i].id === hadithId) {
              cachedHadiths.splice(i, 1);
              break;
            }
          }
        }
      });
      return d;
    }

    return {
      getHadith: getHadith,
      getHadiths: getHadiths,
      postHadith: postHadith,
      putHadith: putHadith,
      deleteHadith: deleteHadith
    };
  });
}());

