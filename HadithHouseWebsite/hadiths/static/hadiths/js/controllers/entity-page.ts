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

module HadithHouse.Controllers {
  import IEntity = HadithHouse.Services.IEntity;
  export abstract class EntityPageCtrl<T extends ng.resource.IResource<IEntity>> {
    entity:T;
    addingNew:boolean;
    isEditing:boolean;

    constructor(private $scope:ng.IScope,
                private $rootScope:ng.IScope,
                private $location:ng.ILocationService,
                private $routeParams:any,
                private EntityResource:ng.resource.IResourceClass<T>,
                private ToastService:any) {
      if (this.$routeParams.id === 'new') {
        this.setAddingNewBookMode();
      } else {
        this.setOpeningExitingBookMode(this.$routeParams.id );
      }
    }

    /**
     * Makes a copy of the data of the entity in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected abstract copyEntity();

    /**
     * Restores the saved data of the entity after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected abstract restoreEntity();

    protected abstract newEntity() : T;

    private setAddingNewBookMode() {
      this.entity = this.newEntity();
      this.addingNew = true;
      this.isEditing = true;
    }

    private setOpeningExitingBookMode(id: string) {
      this.entity = this.EntityResource.get({id: id});
      this.addingNew = false;
      this.isEditing = false;
    }

    /**
     * Called when the user clicks on the edit icon to start editing the entity.
     */
    private startEditing() {
      this.copyEntity();
      this.isEditing = true;
    }

    /**
     * Called when the user clicks on the save icon to save the changes made.
     */
    private finishEditing() {
      // Send the changes to the server.
      this.entity.$save((result) => {
        if (this.addingNew) {
          this.$location.path('book/' + this.entity.id);
        }
        // Successfully saved changes. Don't need to do anything.
        this.isEditing = false;
        this.addingNew = false;
        this.ToastService.show("Successful.");
      }, (result) => {
        if (result.data) {
          this.ToastService.showDjangoError("Failed to save changes. Error was: ", result.data);
        } else {
          this.ToastService.show("Failed to save changes. Please try again.");
        }
      });
    };

    /**
     * Called when the user clicks on the X icon to cancel the changes made.
     */
    private cancelEditing() {
      this.isEditing = false;
      this.restoreEntity();
    };
  }
}
