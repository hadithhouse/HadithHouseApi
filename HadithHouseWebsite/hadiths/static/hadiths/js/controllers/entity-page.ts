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

import * as _ from "lodash"
import {CacheableResource, Entity} from "resources/resources";
import {ILocationService, IScope} from "angular";

export abstract class EntityPageCtrl<TEntity extends Entity<number | string>> {
  // TODO: Should entity be public?
  public entity: TEntity;
  private entityCopy: TEntity;
  private error: string;
  private isAddingNew: boolean;
  private isEditing: boolean;

  constructor(protected $scope: IScope,
              protected $rootScope: IScope,
              protected $location: ILocationService,
              protected $routeParams: any,
              protected EntityResource: CacheableResource<TEntity, number | string>) {
    this.error = null;
    this.entityCopy = EntityResource.create();
  }

  public initialize() {
    if (this.$routeParams.id === 'new') {
      this.setAddingNewEntityMode();
    } else {
      let id = parseInt(this.$routeParams.id);
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

  protected onKeyUp = (e: any) => {
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

  protected newEntity(): TEntity {
    return this.EntityResource.create();
  }

  protected abstract getEntityPath(id: number | string);

  protected onEntityLoaded() {
  }

  protected beforeSave(): boolean {
    return true;
  }

  protected afterSave() {
  }

  protected setAddingNewEntityMode() {
    this.entity = this.newEntity();
    this.isAddingNew = true;
    this.isEditing = true;
  }

  protected setOpeningExistingEntityMode(id: number | string) {
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
    if (!this.beforeSave()) {
      return;
    }
    // Send the changes to the server.
    this.entity.save().then((result) => {
      if (this.isAddingNew) {
        this.$location.path(this.getEntityPath(this.entity.id));
      }
      // Successfully saved changes. Don't need to do anything.
      this.isEditing = false;
      this.isAddingNew = false;
      toastr.success('Saved');
    }, (result) => {
      if (result.data) {
        let message = 'Failed to save changes. Error was: ';
        message += '\n';
        _.each(result.data, function (errors, fieldName) {
          message += fieldName;
          message += ': ';
          message += errors.join(', ');
          message += '\n';
        });
        toastr.error(message);
      } else {
        toastr.error('Failed to save changes. Please try again.');
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
