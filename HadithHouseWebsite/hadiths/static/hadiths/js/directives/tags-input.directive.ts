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

import {HadithHouseApp} from "app-def";
import {IAugmentedJQuery, ILocationProvider, IScope} from "angular";
import {Book, CacheableResource, Entity, HadithTag, Person, User} from "resources/resources";
import "bootstrap"

declare function getHtmlBasePath(): String;

export class TagsInputCtrl {
  public onAdd: any;
  public type: string;
  public selectionMode: string;
  public text: string;
  public entities: Entity<number>[];
  public autoCompleteEntries: any[];
  private EntityResource: CacheableResource<Entity<number>, number>;

  constructor(private $scope: IScope,
              private $element: IAugmentedJQuery,
              private $location: ILocationProvider,
              private PersonResource: CacheableResource<Person, number>,
              private BookResource: CacheableResource<Book, number>,
              private HadithTagResource: CacheableResource<HadithTag, number>,
              private UserResource: CacheableResource<User, number>) {
  }

  public $onInit() {
    if (!this.type || typeof(this.type) !== 'string') {
      throw 'hh-entity-lookup must have its type attribute set to a string.';
    }
    if (!this.selectionMode) {
      this.selectionMode = 'multi';
    }
    if (!this.entities) {
      this.entities = [];
    }
    this.$scope.$watch(() => this.text, (newText, oldText) => {
      if (this.text && this.text.length > 2) {
        this.findEntities(this.text).promise.then((result) => {
          this.showAutoComplete(result);
        });
      } else {
        this.hideAutoComplete();
      }
    });
    this.setEntityResource();
  }

  public onKey($event) {
    switch ($event.which) {
      case 8:
        this.onBackspace();
        break;

      case 13:
        this.onEnter();
        break;
    }
  }

  public deleteEntity(index: number) {
    if (typeof(index) !== 'number') {
      throw 'Index must be a number.';
    }
    if (index < 0) {
      throw 'Index must not be negative.';
    }
    if (index >= this.entities.length) {
      throw 'Index out of range.';
    }
    this.entities.splice(index, 1);
  }

  public addEntity(entity: any) {
    if (entity.id == 'create-entity') {
      switch (this.type.toLowerCase()) {
        case 'hadithtag':
          let newEntity : HadithTag = <HadithTag>this.EntityResource.create();
          newEntity.name = entity.name;
          newEntity.save().then(() => {
            this.addEntity(newEntity);
          });
          break;

        default:
          toastr.error('Not implemented yet :(');
      }
      return;
    }
    if (this.selectionMode === 'single') {
      this.entities = [entity];
      this.text = '';
    } else {
      this.entities.push(entity);
      this.text = '';
    }
  }

  private setEntityResource() {
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
  }

  private findEntities(query):ObjectWithPromise<Entity<number>[]>  {
    return this.EntityResource.query({search: query});
  }

  private autoCompleteSuggestionsContains(entities:Entity<number>[], query) {
    switch (this.type.toLowerCase()) {
      case 'hadithtag':
        return _.some(entities.map(e => (<HadithTag>e).name), name => name == query);

      default:
        toastr.error('Not implemented yet :(');
    }
  }

  private showAutoComplete(entities:Entity<number>[], originalQuery) {
    this.autoCompleteEntries = entities;
    if (this.autoCompleteEntries.length == 0 || !this.autoCompleteSuggestionsContains(entities, originalQuery)) {
      this.autoCompleteEntries.push({
        id: 'create-entity',
        name: originalQuery,
        toString: function() {
          return `Create: ${originalQuery}`;
        }
      });
    }
    let input = this.$element.find('input');
    let pos = input.offset();
    pos.top += input.height();
    let dropdown: any = this.$element.find('.dropdown-menu');
    dropdown.dropdown('toggle');
    dropdown.show();
    dropdown.offset(pos);
  }

  private hideAutoComplete() {
    this.$element.find('.dropdown-menu').hide();
  }

  private isInputEmpty(): boolean {
    return typeof(this.text) === 'undefined' || this.text === null || this.text === '';
  }

  private onBackspace() {
    if (this.isInputEmpty() && this.entities.length > 0) {
      this.entities.pop();
    }
  }

  private onEnter() {
    if (typeof(this.text) !== 'undefined' && this.text !== null && this.text !== '') {
      this.addEntity(this.text);
    }
  }
}

HadithHouseApp.controller('TagsInputCtrl',
  ['$scope', '$element', '$location', 'PersonResource', 'BookResource', 'HadithTagResource', 'UserResource',
    TagsInputCtrl]);

HadithHouseApp.directive('hhTagsInput', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: getHtmlBasePath() + 'directives/tags-input.directive.html',
    controller: 'TagsInputCtrl',
    controllerAs: 'ctrl',
    bindToController: true,
    scope: {
      onAdd: '&?',
      type: '@',
      selectionMode: '@',
      entities: '='
    }
  };
});
