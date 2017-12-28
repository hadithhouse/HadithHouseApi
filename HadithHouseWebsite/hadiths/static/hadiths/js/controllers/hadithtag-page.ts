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

import {ILocationService, IScope} from "angular";
import {HadithTag, CacheableResource} from "resources/resources";
import {EntityPageCtrl} from "controllers/entity-page";
import {HadithHouseApp} from "app-def";

export class HadithTagPageCtrl extends EntityPageCtrl<HadithTag> {
  private HadithTagResource:CacheableResource<HadithTag, number>;

  constructor($scope:IScope,
              $rootScope:IScope,
              $location:ILocationService,
              $routeParams:any,
              HadithTagResource:CacheableResource<HadithTag, number>) {
    super($scope, $rootScope, $location, $routeParams, HadithTagResource);
    this.HadithTagResource = HadithTagResource;
  }

  protected getEntityPath(id: number) {
    return 'hadithtag/' + id;
  }
}

export function HadithTagPageCtrlCreator($scope, $rootScope, $location, $routeParams, HadithTagResource) {
  let ctrl = new HadithTagPageCtrl($scope, $rootScope, $location, $routeParams, HadithTagResource);
  ctrl.initialize();
  return ctrl;
}

HadithHouseApp.controller('HadithTagPageCtrl', HadithTagPageCtrlCreator);

