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
import {
  Book,
  CacheableResource,
  Entity,
  HadithTag,
  Person,
  User
} from "resources/resources";
import { IAugmentedJQuery, IScope } from "angular";
import "typeahead";
import { getApp } from "../app-def";

declare function getHtmlBasePath(): string;

export class EntityLookupCtrl {
  public type: string;
  public callback: any;
  private entityResource: CacheableResource<Entity<number>, number>;
  static $inject = ["$scope", "PersonResource", "BookResource",
    "HadithTagResource", "UserResource"];

  constructor(private $scope: IScope,
              private personResource: CacheableResource<Person, number>,
              private bookResource: CacheableResource<Book, number>,
              private hadithTagResource: CacheableResource<HadithTag, number>,
              private userResource: CacheableResource<User, number>) {
  }

  public $onInit = () => {

    if (!this.type || typeof(this.type) !== "string") {
      throw new Error("hh-entity-lookup must have its type attribute set " +
        "to a string.");
    }
    if (!this.callback) {
      throw new Error("hh-entity-lookup elector must have its callback " +
        "attribute set.");
    }

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
        throw new Error("Invalid type for hh-entity-lookup.");
    }
  };

  public onSelect(entity) {
    this.callback({entity});
  }

  public findEntities(query) {
    return this.entityResource.query({search: query});
  }
}

getApp().controller("EntityLookupCtrl", EntityLookupCtrl);

getApp().directive("hhEntityLookup", () => {
  return {
    restrict: "E",
    replace: true,
    templateUrl: getHtmlBasePath() + "directives/entity-lookup.directive.html",
    controller: "EntityLookupCtrl",
    controllerAs: "ctrl",
    bindToController: true,
    scope: {
      callback: "&",
      type: "@"
    },
    link: (scope: IScope & { ctrl: EntityLookupCtrl },
           element: IAugmentedJQuery) => {
      const input: any = element.find("input");

      input.bind("typeahead:select", (event, entity) => {
        scope.ctrl.onSelect(entity);
      });

      input.typeahead({
        highlight: true
      }, {
        display(entity) {
          if (!entity) {
            return "";
          }
          return entity.toString();
        },
        source(query, syncResults, asyncResults) {
          // TODO: Should we add onError() and show an error message?
          scope.ctrl.findEntities(query).promise.then((result) => {
            asyncResults(result);
          });
        },
      });
    }
  };
});
