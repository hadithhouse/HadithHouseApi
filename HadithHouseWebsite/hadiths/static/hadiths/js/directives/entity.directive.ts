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
import {HadithHouseApp} from "app-def";
import angular from "angular"

declare function getHtmlBasePath(): String;

export class EntityCtrl {
  public entityId: string = null;
  public entity: Entity<number> = null;
  public type: string;
  public mode: string;
  public normalisedMode: string | boolean;
  public clickCallback: any;
  public firstLoad = true;
  private EntityResource: CacheableResource<Entity<number>, number>;

  constructor(private $scope: IScope,
              private $location: ILocationService,
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
    switch (this.mode.toLowerCase()) {
      case 'text':
        this.normalisedMode = 'text';
        break;
      case 'link':
        this.normalisedMode = 'link';
        break;
      case 'button':
        this.normalisedMode = 'button';
        break;
      case 'badge':
        this.normalisedMode = 'badge';
        break;
      case 'clickable-badge':
        this.normalisedMode = 'clickable-badge';
        break;
      default:
        throw 'Invalid type for hh-entity element.';
    }

    if (!this.type || typeof(this.type) !== 'string') {
      throw 'hh-entity element must have its type attribute set to a string.';
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
        throw 'Invalid type for hh-entity element.';
    }

    this.$scope.$watch('ctrl.entityId', this.onIdChanged);
  };

  public onClick() {
    if (this.normalisedMode === 'text') {
      return;
    }
    if (this.clickCallback) {
      this.clickCallback({entity: this.entity});
    } else {
      this.$location.path(`/${this.type}/${this.entity.id}`);
    }
  }

  public getEntityTitle(): string {
    if (!this.entity) {
      return '';
    }
    return this.entity.toString();
  }

  public getEntityLink(): string {
    return `/${this.type}/${this.entity.id}`;
  }

  private onIdChanged = (newValue, oldValue) => {
    if (newValue && this.firstLoad) {
      // An ID(s) was(were) passed to the entity and this.entity have not been set yet, so we set it.
      this.firstLoad = false;
    } else {
      // The entity has already been loaded, so we just check whether we have
      // changes in the ID that we need to refresh
      if (newValue !== oldValue) {
        return;
      }
    }
    if (this.entityId !== null && this.entityId !== '' && typeof(this.entityId) !== 'undefined') {
      this.entity = this.EntityResource.get(parseInt(this.entityId));
    } else {
      this.entity = null;
    }
  };
}

HadithHouseApp.controller('EntityCtrl',
  ['$scope', '$location', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource', EntityCtrl]);

// TODO: Consider creating a class for this.
HadithHouseApp.component('hhEntity', {
  templateUrl: getHtmlBasePath() + 'directives/entity.directive.html',
  controller: 'EntityCtrl',
  controllerAs: 'ctrl',
  bindings: {
    clickCallback: '&?',
    mode: '@',
    entityId: '@',
    type: '@'
  }
});
