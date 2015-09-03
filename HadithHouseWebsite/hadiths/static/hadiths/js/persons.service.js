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

  HadithHouseApp.factory('PersonsService', function ($http, $q, $mdDialog) {
    var getApiUrl = window['getApiUrl'];

    var cachedPersons = null;
    var personsDict = null;

    /**
     * Retrieves the person having the given ID.
     * @param personId The ID of the person.
     * @returns A promise resolving on success to the required person.
     */
    function getPerson(personId) {
      var deferred = $q.defer();

      if (personsDict[personId]) {
        deferred.resolve(personsDict[personId]);
        return deferred.promise;
      }

      $http.get(getApiUrl() + 'persons/' + personId).then(function onSuccess(response) {
        var person = response.data;
        deferred.resolve(person);
      }, function onError(reason) {
        deferred.reject(reason);
      });

      return deferred.promise;
    }

    function getPersonSync(personId) {
      if (!personsDict) {
        throw "Persons are not loaded yet.";
      }
      return personsDict[personId] || null;
    }

    function createPersonsDict() {
      personsDict = {};
      _.each(cachedPersons, function(person) {
        personsDict[person.Id] = personsDict;
      });
    }

    function getPersons() {
      var deferred = $q.defer();

      if (cachedPersons != null) {
        deferred.resolve(cachedPersons);
        return deferred.promise;
      }

      $http.get(getApiUrl() + 'persons/').then(function onSuccess(response) {
        cachedPersons = response.data;
        createPersonsDict();
        deferred.resolve(cachedPersons);
      }, function onError(reason) {
        deferred.reject(reason);

        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title("Error")
            .content("Couldn't load persons! Please try again or refresh the page.")
            .ariaLabel('Error')
            .ok('OK')
        );
      });

      return deferred.promise;
    }

    return {
      getPerson: getPerson,
      getPersonSync: getPersonSync,
      getPersons: getPersons
    };
  });
}());

