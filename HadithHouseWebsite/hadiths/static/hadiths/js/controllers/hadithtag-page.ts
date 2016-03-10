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
/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="entity-page.ts" />

module HadithHouse.Controllers {
  import IHadithTag = HadithHouse.Services.IHadithTagResource;
  import IHadithTagResource = HadithHouse.Services.IHadithTagResourceClass;

  export class HadithTagPageCtrl extends EntityPageCtrl<IHadithTag> {
    oldHadithTag:IHadithTag;
    HadithTagResource:Services.IHadithTagResourceClass;

    constructor($scope:ng.IScope,
                $rootScope:ng.IScope,
                $location:ng.ILocationService,
                $routeParams:any,
                HadithTagResource:Services.IHadithTagResourceClass,
                ToastService:any) {
      // Setting HadithTagResource before calling super, because super might end up
      // calling methods which requires HadithTagResource, e.g. newEntity().
      this.HadithTagResource = HadithTagResource;
      this.oldHadithTag = new this.HadithTagResource({});
      super($scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService);
    }

    /**
     * Makes a copy of the data of the tag in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyEntity() {
      this.oldHadithTag.name = this.entity.name;
    }

    /**
     * Restores the saved data of the tag after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreEntity() {
      this.entity.name = this.oldHadithTag.name;
    }

    protected newEntity():IHadithTag {
      return new this.HadithTagResource({
        title: '',
        brief_desc: '',
        pub_year: null
      });
    }

    protected getEntityPath(id: number) {
      return 'hadithtag/' + id;
    }
  }

  HadithHouse.HadithHouseApp.controller('HadithTagPageCtrl',
    function ($scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService) {
      return new HadithTagPageCtrl($scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService);
    });
}
