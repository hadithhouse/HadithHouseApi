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

/// <reference path="../../../../../TypeScriptDefs/jquery/jquery.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="../resources/resources.ts" />

module HadithHouse.Controllers {
  import IEntity = HadithHouse.Services.IEntity;
  import IResource = angular.resource.IResource;
  import CacheableResource = HadithHouse.Resources.CacheableResource;
  import Entity = HadithHouse.Resources.Entity;

  export abstract class EntityPageCtrl<TEntity extends Entity<number>> {
    entity:TEntity;
    entityCopy:TEntity;
    isAddingNew:boolean;
    isEditing:boolean;
    error:string;

    constructor(protected $scope:ng.IScope,
                protected $rootScope:ng.IScope,
                protected $location:ng.ILocationService,
                protected $routeParams:any,
                protected EntityResource:CacheableResource<TEntity, number>,
                protected ToastService:any) {
      this.error = null;
      this.entityCopy = EntityResource.create();
    }
    
    public initialize() {
      if (this.$routeParams.id === 'new') {
        this.setAddingNewEntityMode();
      } else {
        var id = parseInt(this.$routeParams.id);
        if (isNaN(id)) {
          this.error = `'${this.$routeParams.id}' is not a valid ID!`;
          return;
        }
        this.setOpeningExistingEntityMode(id);
      }
      $(document).on('keyup', this.onKeyUp);
      this.$scope.$on('$destroy', () => {
        $(document).off('keyup', this.onKeyUp);
      });
    }

    protected onKeyUp = (e:any) => {
      if (e.keyCode === 27) {
        console.log('test');
        this.cancelEditing();
        this.$scope.$apply();
      }
    };

    /**
     * Makes a copy of the data of the entity in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyEntity() {
      this.entityCopy.set(this.entity);
    }

    /**
     * Restores the saved data of the entity after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreEntity() {
      this.entity.set(this.entityCopy);
    }

    protected newEntity():TEntity {
      return this.EntityResource.create();
    }

    protected abstract getEntityPath(id:number);

    protected onEntityLoaded() {

    }

    protected setAddingNewEntityMode() {
      this.entity = this.newEntity();
      this.isAddingNew = true;
      this.isEditing = true;
    }

    protected setOpeningExistingEntityMode(id:number) {
      this.entity = this.EntityResource.get(id);
      this.entity.promise.then(() => {
        this.onEntityLoaded();
      });
      this.isAddingNew = false;
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
    private finishEditing = () => {
      // Send the changes to the server.
      this.entity.save().then((result) => {
        if (this.isAddingNew) {
          this.$location.path(this.getEntityPath(this.entity.id));
        }
        // Successfully saved changes. Don't need to do anything.
        this.isEditing = false;
        this.isAddingNew = false;
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
      if (this.isEditing) {
        this.isEditing = false;
        this.restoreEntity();
      }
    };
  }
}
