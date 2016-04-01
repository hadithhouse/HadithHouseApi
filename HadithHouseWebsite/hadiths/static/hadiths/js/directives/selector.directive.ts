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

/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular-resource.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="../resources/resources.ts" />


module HadithHouse.Directives {
  import IQService = angular.IQService;
  import IScope = angular.IScope;
  import CacheableResource = HadithHouse.Resources.CacheableResource;
  import Entity = HadithHouse.Resources.Entity;
  import Person = HadithHouse.Resources.Person;
  import Book = HadithHouse.Resources.Book;
  import HadithTag = HadithHouse.Resources.HadithTag;
  import User = HadithHouse.Resources.User;

  export class SelectorCtrl {
    EntityResource:CacheableResource<Entity<number>, number>;
    ids:number|number[];
    entities:any;
    type:string;
    singleSelect:string;
    textOnly:string;
    clickable:string;
    firstLoad = true;

    constructor(private $scope:IScope,
                private PersonResource:CacheableResource<Person, number>,
                private BookResource:CacheableResource<Book, number>,
                private HadithTagResource:CacheableResource<HadithTag, number>,
                private UserResource:CacheableResource<User, number>) {

      if (!this.ids) {
        if (this.singleSelect) {
          this.ids = null;
        } else {
          this.ids = [];
        }
      }

      if (!this.entities) {
        this.entities = [];
      }

      if (!this.textOnly) {
        this.textOnly = 'false';
      }

      if (!this.clickable) {
        this.clickable = 'false';
      }

      if (!this.type || typeof(this.type) !== 'string') {
        throw 'Selector must have its type attribute set to a string.';
      }

      switch (this.type.toLowerCase()) {
        case 'person':
          this.EntityResource = PersonResource;
          break;

        case 'book':
          this.EntityResource = BookResource;
          break;

        case 'hadithtag':
          this.EntityResource = HadithTagResource;
          break;

        case 'user':
          this.EntityResource = UserResource;
          break;

        default:
          throw 'Invalid type for selector.';
      }

      //$scope.$watch('ctrl.ids', this.onIdsChanged);
      $scope.$watchCollection('ctrl.ids', this.onIdsChanged);

      //$scope.$watch('ctrl.entities', this.onEntitiesChanged);
      $scope.$watchCollection('ctrl.entities', this.onEntitiesChanged);
    }



    private onIdsChanged = (newValue, oldValue) => {
      if (newValue && this.firstLoad) {
        // An ID(s) was(were) passed to the selector and this.entities have not
        // been set yet, so we set it.
        this.firstLoad = false;
      } else {
        // The selector has already been loaded, so we just check whether we have
        // changes in the ID that we need to refresh
        if (angular.equals(newValue, oldValue)) {
          return;
        }
      }
      if (this.singleSelect) {
        if (this.ids !== null) {
          this.entities = [<number>this.ids].map((id) => {
            // See if we already have the entity loaded, otherwise make a request to load it.
            return _.find<Entity<number>>(this.entities, (e) => {
                return e.id == id;
              }) || this.EntityResource.get(id);
          });
        } else {
          this.entities = [];
        }
      } else {
        this.entities = (<number[]>this.ids).map((id) => {
          // See if we already have the entity loaded, otherwise make a request to load it.
          return _.find<Entity<number>>(this.entities, (e) => {
              return e.id == id;
            }) || this.EntityResource.get(id);
        });
      }
    }

    private onEntitiesChanged = (newValue, oldValue) => {
      if (newValue && oldValue && angular.equals(newValue, oldValue)) {
        return;
      }
      if (this.entities) {
        // If the control only allows single select, we remove every elements
        // before the last.
        if (this.singleSelect === 'true') {
          // Single select mode, so only allow one entity to be selected and delete previous ones.
          if (this.entities.length > 1) {
            this.entities.splice(0, this.entities.length - 1);
          }
          if (this.entities.length == 1) {
            // Ensure that the resource has been resolved before updating the scope's ID
            if (typeof(this.entities[0].id) === 'number') {
              this.ids = this.entities[0].id;
            }
          } else {
            this.ids = null;
          }
        } else {
          if (_.every(this.entities, (e:any) => {
              return typeof(e.id) === 'number';
            })) {
            this.ids = this.entities.map((entity) => {
              return entity.id;
            });
          }
        }
      }
    }

    public findEntities(query) {
      return this.EntityResource.query({search: query});
    };

    public entityToString = (entity) => {
      switch (this.type.toLowerCase()) {
        case 'person':
          return entity.display_name || entity.full_name;

        case 'book':
          return entity.title;

        case 'hadithtag':
          return entity.name;

        case 'user':
          return `${entity.first_name} ${entity.last_name}`;

        default:
          throw 'Unreachable code';
      }
    }
  }

  HadithHouseApp.controller('SelectorCtrl',
    ['$scope', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource', SelectorCtrl]);

  // TODO: Consider creating a class for this.
  HadithHouseApp.directive('hhSelector', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'directives/selector.directive.html',
      controller: 'SelectorCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        ids: '=',
        type: '@',
        readOnly: '=',
        singleSelect: '@',
        textOnly: '@',
        clickable: '@'
      }
    };
  });
}
