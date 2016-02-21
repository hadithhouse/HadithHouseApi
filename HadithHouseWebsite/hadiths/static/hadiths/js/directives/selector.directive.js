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

  HadithHouseApp.controller('SelectorCtrl', function ($q, $scope, PersonResource, BookResource, HadithTag) {
    var ctrl = this;

    if (!$scope.ids) {
      if ($scope.singleSelect) {
        $scope.ids = null;
      } else {
        $scope.ids = [];
      }
    }

    if (!$scope.entities) {
      $scope.entities = [];
    }

    if (!$scope.type || typeof($scope.type) !== 'string') {
      throw 'Selector must have its type attribute set to a string.';
    }

    switch ($scope.type.toLowerCase()) {
      case 'person':
        $scope.Entity = PersonResource;
        break;

      case 'book':
        $scope.Entity = BookResource;
        break;

      case 'hadithtag':
        $scope.Entity = HadithTag;
        break;

      default:
        throw 'Invalid type for selector.';
    }


    function onIdsChanged(newValue, oldValue) {
      if (newValue && oldValue && newValue.toString() === oldValue.toString()) {
        return;
      }
      if ($scope.singleSelect) {
        if ($scope.ids !== null) {
          $scope.entities = [$scope.ids].map(function (id) {
            // See if we already have the entity loaded, otherwise make a request to load it.
            return _.find($scope.entities, function (e) {
                return e.id == id;
              }) || $scope.Entity.get({id: id}, function (e) {
              });
          });
        } else {
          $scope.entities = [];
        }
      } else {
        $scope.entities = $scope.ids.map(function (id) {
          // See if we already have the entity loaded, otherwise make a request to load it.
          return _.find($scope.entities, function (e) {
              return e.id == id;
            }) || $scope.Entity.get({id: id});
        });
      }
    }

    $scope.$watch('ids', onIdsChanged);
    $scope.$watchCollection('ids', onIdsChanged);

    function onEntitiesChanged(newValue, oldValue) {
      if ($scope.entities) {
        // If the control only allows single select, we remove every elements
        // before the last.
        if ($scope.singleSelect === true) {
          // Single select mode, so only allow one entity to be selected and delete previous ones.
          if ($scope.entities.length > 1) {
            $scope.entities.splice(0, $scope.entities.length - 1);
          }
          if ($scope.entities.length == 1) {
            // Ensure that the resource has been resolved before updating the scope's ID
            if (typeof($scope.entities[0].id) === 'number') {
              $scope.ids = $scope.entities[0].id;
            }
          } else {
            $scope.ids = null;
          }
        } else {
          if (_.every($scope.entities, function (e) {
              return typeof(e.id) === 'number';
            })) {
            $scope.ids = $scope.entities.map(function (entity) {
              return entity.id;
            });
          }
        }
      }
    }

    $scope.$watch('entities', onEntitiesChanged);
    $scope.$watchCollection('entities', onEntitiesChanged);

    function filterPersons(persons, query) {
      return persons.filter(function (person) {
        return (person.title.indexOf(query) > -1 ||
        (person.display_name && person.display_name.indexOf(query) > -1) ||
        (person.full_name && person.full_name.indexOf(query) > -1) ||
        (person.brief_desc && person.brief_desc.indexOf(query) > -1));
      });
    }

    function filterBooks(books, query) {
      return books.filter(function (book) {
        return (book.title.indexOf(query) > -1);
      });
    }

    function filterHadithTags(hadithTags, query) {
      return hadithTags.filter(function (tag) {
        return tag.name.indexOf(query) > -1 &&
          $scope.entities.map(function (t) {
            return t.name;
          }).indexOf(query) == -1;
      });
    }

    ctrl.findEntities = function (query) {
      return $scope.queryResults = $scope.Entity.query({search: query});
    };

    ctrl.entityToString = function (entity) {
      switch ($scope.type.toLowerCase()) {
        case 'person':
          return entity.display_name || entity.full_name;

        case 'book':
          return entity.title;

        case 'hadithtag':
          return entity.name;

        default:
          throw 'Unreachable code';
      }
    }
  });

  HadithHouseApp.directive('hhSelector', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'directives/selector.directive.html',
      controller: 'SelectorCtrl',
      controllerAs: 'ctrl',
      //bindToController: true,
      scope: {
        ids: '=',
        type: '@',
        readOnly: '=',
        singleSelect: '='
      }
    };

  });
}());