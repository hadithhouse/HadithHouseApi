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
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="entity-page.ts" />

module HadithHouse.Controllers {
  import IEntity = HadithHouse.Services.IEntity;
  import IResourceArray = angular.resource.IResourceArray;
  import List = _.List;
  import IResource = angular.resource.IResource;

  export class EntityListingPageCtrl<T extends IEntity> {
    entities:IResourceArray<T & IResource<T>>;

    constructor(private $scope:ng.IScope,
                private $rootScope:ng.IScope,
                private $mdDialog:ng.material.IDialogService,
                private EntityResource:ng.resource.IResourceClass<T & IResource<T>>,
                private ToastService:any) {

      this.loadEntities();
    }

    private loadEntities() {
      // TODO: Show an alert if an error happens.
      this.entities = this.EntityResource.query();
    }

    private deleteEntity = (event:any, entity:T) => {
      var confirm = this.$mdDialog.confirm()
        .title('Confirm')
        .textContent('Are you sure you want to delete the entity?')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      this.$mdDialog.show(confirm).then(() => {
        this.EntityResource.delete({id: entity.id}, () => {
          this.ToastService.show('Successfully deleted');
          this.entities = this.entities.filter((e) => { return e.id != entity.id; });
        }, (result) => {
          if (result.data && result.data.detail) {
            this.ToastService.show("Failed to delete entity. Error was: " + result.data.detail);
          } else if (result.data) {
            this.ToastService.show("Failed to delete entity. Error was: " + result.data);
          } else {
            this.ToastService.show("Failed to delete entity. Please try again!");
          }
        });
      });
    }
  }
}
