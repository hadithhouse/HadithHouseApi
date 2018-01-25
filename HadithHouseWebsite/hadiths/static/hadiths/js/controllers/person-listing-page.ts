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
import {CacheableResource, Person} from "resources/resources";
import {EntityListingPageCtrl} from "controllers/entity-listing-page";
import {ILocationService, IScope, ITimeoutService} from "angular";
import { getApp } from "../app-def";

export class PersonListingPageCtrl extends EntityListingPageCtrl<Person> {
  constructor($scope:IScope,
              $rootScope:IScope,
              $timeout:ITimeoutService,
              $location:ILocationService,
              private PersonResource:CacheableResource<Person, number>) {
    super($scope, $rootScope, $timeout, $location, PersonResource, 'person');
  }
}

export function PersonListingPageCtrlCreator($scope, $rootScope, $timeout, $location, PersonResource) {
  return new PersonListingPageCtrl($scope, $rootScope, $timeout, $location, PersonResource);
}

getApp().controller('PersonListingPageCtrl', PersonListingPageCtrlCreator);
