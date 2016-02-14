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

  HadithHouseApp.factory('PersonsService', function ($http, $q, $mdDialog, $rootScope) {
    var cachedPersons = null;
    var personsDict = {};
    var personsDictCreated = false;

    // TODO: This function duplicated in the other services as well; consider
    // defining it somewhere else, e.g. $rootScope.
    function getUrl(relativePath) {
      var getApiUrl = window['getApiUrl'];

      return getApiUrl() + relativePath;
    }

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

      $http.get(getUrl('persons/' + personId)).then(function onSuccess(response) {
        var person = response.data;
        deferred.resolve(person);
      }, function onError(reason) {
        deferred.reject(reason);
      });

      return deferred.promise;
    }

    function getPersonSync(personId) {
      if (!personsDictCreated) {
        throw "Persons are not loaded yet.";
      }
      return personsDict[personId] || null;
    }

    function createPersonsDict() {
      personsDict = {};
      personsDictCreated = true;
      _.each(cachedPersons, function(person) {
        personsDict[person.id] = person;
      });
    }

    function getPersons() {
      var deferred = $q.defer();

      if (cachedPersons != null) {
        deferred.resolve(cachedPersons);
        return deferred.promise;
      }

      $http.get(getUrl('persons/')).then(function onSuccess(response) {
        cachedPersons = response.data.results;
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

    function postPerson(person) {
      var d = $http.post(getUrl('persons/'), person);
      d.then(function onSuccess(result) {
        var newPerson = result.data;
        if (cachedPersons !== null) {
          cachedPersons.push(newPerson);
        }
      });
      return d;
    }

    function putPerson(person) {
      var d = $http.put(getUrl('persons/' + person.id), person);
      d.then(function onSuccess(result) {
        var newPerson = result.data;
        if (cachedPersons !== null) {
          for (var i = 0; i < cachedPersons.length; i++) {
            if (cachedPersons[i].id === newPerson.id) {
              cachedPersons[i] = newPerson;
              break;
            }
          }
        }
      });
      return d;
    }

    function deletePerson(personId) {
      var d = $http.delete(getUrl('persons/' + personId));
      d.then(function onSuccess(result) {
        if (cachedPersons !== null) {
          for (var i = 0; i < cachedPersons.length; i++) {
            if (cachedPersons[i].id === personId) {
              cachedPersons.splice(i, 1);
              break;
            }
          }
        }
      });
      return d;
    }
    return {
      getPerson: getPerson,
      getPersonSync: getPersonSync,
      getPersons: getPersons,
      postPerson: postPerson,
      putPerson: putPerson,
      deletePerson: deletePerson
    };
  });
}());

