/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Rafid Khalid Al-Humaimidi
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
import {Book, CacheableResource, Entity, HadithTag, Person, User} from "resources/resources";
import {IAugmentedJQuery, IScope} from "angular";
import angular from "angular"
import "typeahead"
import { getApp } from "../app-def";

declare function getHtmlBasePath(): string;

export class EntityLookupCtrl {
  public type: string;
  public callback: any;
  private EntityResource: CacheableResource<Entity<number>, number>;

  constructor(private $scope: IScope,
              private PersonResource: CacheableResource<Person, number>,
              private BookResource: CacheableResource<Book, number>,
              private HadithTagResource: CacheableResource<HadithTag, number>,
              private UserResource: CacheableResource<User, number>) {
    // Prior to v1.5, we need to call `$onInit()` manually.
    // (Bindings will always be pre-assigned in these versions.)
    if (angular.version.major === 1 && angular.version.minor < 5) {
      this.$onInit();
    }
  }

  public $onInit = () => {

    if (!this.type || typeof(this.type) !== 'string') {
      throw 'hh-entity-lookup must have its type attribute set to a string.';
    }
    if (!this.callback) {
      throw 'hh-entity-lookup elector must have its callback attribute set.';
    }

    switch (this.type.toLowerCase()) {
      case 'person':
        this.EntityResource = this.PersonResource;
        break;

      case 'book':
        this.EntityResource = this.BookResource;
        break;

      case 'hadithtag':
        this.EntityResource = this.HadithTagResource;
        break;

      case 'user':
        this.EntityResource = this.UserResource;
        break;

      default:
        throw 'Invalid type for hh-entity-lookup.';
    }
  };


  public onSelect(entity) {
    this.callback({entity: entity});
  }

  public findEntities(query) {
    return this.EntityResource.query({search: query});
  }
}

getApp().controller('EntityLookupCtrl',
  ['$scope', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource', EntityLookupCtrl]);

getApp().directive('hhEntityLookup', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: getHtmlBasePath() + 'directives/entity-lookup.directive.html',
    controller: 'EntityLookupCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      callback: '&',
      type: '@'
    },
    link: function (scope: IScope & { ctrl: EntityLookupCtrl }, element: IAugmentedJQuery) {
      let input: any = element.find('input');

      input.bind('typeahead:select', function (event, entity) {
        scope.ctrl.onSelect(entity);
      });

      input.typeahead({
        highlight: true
      }, {
        display: function (entity) {
          if (!entity) {
            return '';
          }
          return entity.toString();
        },
        source: function (query, syncResults, asyncResults) {
          // TODO: Should we add onError() and show an error message?
          scope.ctrl.findEntities(query).promise.then(function onSuccess(result) {
            asyncResults(result);
          });
        },
      });
    }
  };
});
