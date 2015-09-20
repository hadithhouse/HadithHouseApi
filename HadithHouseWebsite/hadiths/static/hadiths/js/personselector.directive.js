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

function waitForPromises(promises, callback) {
  
}

(function () {
  var HadithHouseApp = angular.module('HadithHouseApp');

  function PersonSelectorCtrl($scope, PersonsService) {

  }

  HadithHouseApp.controller('PersonSelectorCtrl', function ($q, $scope, PersonsService) {
    var ctrl = this;

    ctrl.availPersons = [];
    ctrl.availPersonsLoaded = false;

    if (!ctrl.personId) {
      ctrl.personId = null;
    }

    PersonsService.getPersons().then(function onSuccess(persons) {
      ctrl.availPersonsLoaded = true;
      ctrl.availPersons = persons;
    });

    $scope.$watch(function() { return ctrl.personId; }, function() {
      if ((!ctrl.person || ctrl.person.id != ctrl.personId) && ctrl.personId !== null) {
        PersonsService.getPerson(ctrl.personId).then(function(person) {
          ctrl.person = person;
        });
      }
    });
    ctrl.onPersonChange = function() {
      ctrl.personId = ctrl.person.id;
    };

    ctrl.findPersons = function (query) {
      if (!ctrl.availPersonsLoaded) {
        return [];
      }

      return ctrl.availPersons.filter(function (person) {
        return /*ctrl.personId.indexOf(person.id) == -1 &&*/ (
          person.title.indexOf(query) > -1 ||
          person.display_name.indexOf(query) > -1 ||
          person.full_name.indexOf(query) > -1 ||
          person.brief_desc.indexOf(query) > -1);
      });
    };
  });

  HadithHouseApp.directive('hhPersonSelector', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'personselector.directive.html',
      controller: 'PersonSelectorCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        personId: '=',
        readOnly: '='
      }
    };

  });
}());