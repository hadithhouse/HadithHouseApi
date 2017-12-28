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
import {ILocationService, IScope} from "angular";
import angular from "angular"
import _ from "lodash"
import {HadithHouseApp} from "app-def";

declare function getHtmlBasePath(): String;

export class SelectorCtrl {
  public addingEntitiesEnabled:string;
  public ids:number|number[];
  public entities:any;
  public type:string;
  public singleSelect:string;
  public textOnly:string;
  public clickable:string;
  public clickCallback:any;
  public firstLoad = true;
  public query:string;
  private EntityResource:CacheableResource<Entity<number>, number>;

  constructor(private $scope:IScope,
              private $location:ILocationService,
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

    if (!this.addingEntitiesEnabled) {
      this.addingEntitiesEnabled = 'false';
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

    $scope.$watchCollection('ctrl.ids', this.onIdsChanged);
    $scope.$watchCollection('ctrl.entities', this.onEntitiesChanged);
  }


  public onClick(entity) {
    if (this.clickCallback) {
      this.clickCallback({entity: entity});
    } else {
      this.$location.path(`${this.type}/${entity.id}`);
    }
  }

  public findEntities(query) {
    return this.EntityResource.query({search: query});
  }

  public createEntity(query) {
    switch (this.type.toLowerCase()) {
      case 'hadithtag':
        let entity = this.HadithTagResource.create();
        entity.name = query;
        entity.save().then(() => {
          this.entities.push(entity);
          this.query = '';
        }, (result) => {
          // TODO: This code is duplicated. Once we work on issue 86, we can create a helper function in
          // ToastService and use it here. Issue link:
          // https://github.com/hadithhouse/hadithhouse/issues/86
          if (result.data && result.data.detail) {
            toastr.error('Failed to delete entity. Error was: ' + result.data.detail);
          } else if (result.data) {
            toastr.error('Failed to delete entity. Error was: ' + result.data);
          } else {
            toastr.error('Failed to delete entity. Please try again!');
          }
        });
        break;

      case 'person':
      case 'book':
      case 'user':
        throw 'Not implemented yet.';

      default:
        throw 'Unreachable code.';
    }
  }

  public entityToString(entity) {
    return entity.toString();
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
    if (this.singleSelect === 'true') {
      if (this.ids !== null) {
        this.entities = [<number>this.ids].map((id) => {
          // See if we already have the entity loaded, otherwise make a request to load it.
          return _.find<Entity<number>>(this.entities, (e) => {
              return e.id === id;
            }) || this.EntityResource.get(id);
        });
      } else {
        this.entities = [];
      }
    } else {
      this.entities = (<number[]>this.ids).map((id) => {
        // See if we already have the entity loaded, otherwise make a request to load it.
        return _.find<Entity<number>>(this.entities, (e) => {
            return e.id === id;
          }) || this.EntityResource.get(id);
      });
    }
  };

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
        if (this.entities.length === 1) {
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
  };
}

HadithHouseApp.controller('SelectorCtrl',
  ['$scope', '$location', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource',
    SelectorCtrl]);

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
      addingEntitiesEnabled: '@',
      clickCallback: '&?',
      clickable: '@',
      ids: '=',
      readOnly: '=',
      singleSelect: '@',
      textOnly: '@',
      type: '@'
    }
  };
});
