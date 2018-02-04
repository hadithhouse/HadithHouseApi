/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Rafid Khalid Al-Humaimidi
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

import _ from "lodash";
import toastr from "toastr";
import { IAugmentedJQuery, ILocationProvider, IScope } from "angular";
import {
  Book,
  CacheableResource,
  Entity,
  HadithTag,
  ObjectWithPromise,
  Person,
  User
} from "resources/resources";
import "bootstrap";
import { getApp } from "../app-def";

declare function getHtmlBasePath(): string;

export class TagsInputCtrl {
  public onAdd: any;
  public type: string;
  public selectionMode: string;
  public text: string;
  public entities: Entity<number>[];
  public autoCompleteEntries: any[];
  private entityResource: CacheableResource<Entity<number>, number>;
  static $inject = ["$scope", "$element", "$location", "PersonResource",
    "BookResource", "HadithTagResource", "UserResource"];

  constructor(private $scope: IScope,
              private $element: IAugmentedJQuery,
              private $location: ILocationProvider,
              private personResource: CacheableResource<Person, number>,
              private bookResource: CacheableResource<Book, number>,
              private hadithTagResource: CacheableResource<HadithTag, number>,
              private userResource: CacheableResource<User, number>) {
  }

  public $onInit() {
    if (!this.type || typeof(this.type) !== "string") {
      throw new Error("hh-tags-input must have its type attribute set " +
        "to a string.");
    }
    if (!this.selectionMode) {
      this.selectionMode = "multi";
    }
    if (!this.entities) {
      this.entities = [];
    }
    this.$scope.$watch(() => this.text, (/*newText, oldText*/) => {
      if (this.text && this.text.length > 2) {
        this.findEntities(this.text).promise.then((result) => {
          this.showAutoComplete(result, this.text);
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
    if (typeof(index) !== "number") {
      throw new Error("Index must be a number.");
    }
    if (index < 0) {
      throw new Error("Index must not be negative.");
    }
    if (index >= this.entities.length) {
      throw new Error("Index out of range.");
    }
    this.entities.splice(index, 1);
  }

  public addEntity(entity: any) {
    if (entity.id === "create-entity") {
      switch (this.type.toLowerCase()) {
        case "hadithtag":
          const newEntity: HadithTag = <HadithTag>this.entityResource.create();
          newEntity.name = entity.name;
          newEntity.save().then(() => {
            this.addEntity(newEntity);
          });
          break;

        default:
          debugger;
          toastr.error("Not implemented yet :(");
      }
      return;
    }
    if (this.selectionMode === "single") {
      this.entities = [entity];
      this.text = "";
    } else {
      this.entities.push(entity);
      this.text = "";
    }
  }

  private setEntityResource() {
    switch (this.type.toLowerCase()) {
      case "person":
        this.entityResource = this.personResource;
        break;

      case "book":
        this.entityResource = this.bookResource;
        break;

      case "hadithtag":
        this.entityResource = this.hadithTagResource;
        break;

      case "user":
        this.entityResource = this.userResource;
        break;

      default:
        throw new Error("Invalid type for hh-tags-input.");
    }
  }

  private findEntities(query): ObjectWithPromise<Entity<number>[]> {
    return this.entityResource.query({search: query});
  }

  private autoCompleteSuggestionsContains(entities: Entity<number>[], query) {
    switch (this.type.toLowerCase()) {
      case "hadithtag":
        return _.some(entities.map(e => (<HadithTag>e).name),
          name => name === query);

      default:
        debugger;
        toastr.error("Not implemented yet :(");
    }
  }

  private showAutoComplete(entities: Entity<number>[], originalQuery) {
    this.autoCompleteEntries = entities;
    if (this.autoCompleteEntries.length === 0 ||
      !this.autoCompleteSuggestionsContains(entities, originalQuery)) {
      this.autoCompleteEntries.push({
        id: "create-entity",
        name: originalQuery,
        toString: () => {
          return `Create: ${originalQuery}`;
        }
      });
    }
    const input = this.$element.find("input");
    const pos = input.offset();
    pos.top += input.height();
    const dropdown: any = this.$element.find(".dropdown-menu");
    dropdown.dropdown("toggle");
    dropdown.show();
    dropdown.offset(pos);
  }

  private hideAutoComplete() {
    this.$element.find(".dropdown-menu").hide();
  }

  private isInputEmpty(): boolean {
    return typeof(this.text) === "undefined" || this.text === null ||
      this.text === "";
  }

  private onBackspace() {
    if (this.isInputEmpty() && this.entities.length > 0) {
      this.entities.pop();
    }
  }

  private onEnter() {
    if (typeof(this.text) !== "undefined" && this.text !== null &&
      this.text !== "") {
      this.addEntity(this.text);
    }
  }
}

getApp().controller("TagsInputCtrl", TagsInputCtrl);

getApp().directive("hhTagsInput", () => {
  return {
    restrict: "E",
    replace: true,
    templateUrl: getHtmlBasePath() + "directives/tags-input.directive.html",
    controller: "TagsInputCtrl",
    controllerAs: "ctrl",
    bindToController: true,
    scope: {
      onAdd: "&?",
      type: "@",
      selectionMode: "@",
      entities: "="
    }
  };
});
