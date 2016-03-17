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
  import IResource = angular.resource.IResource;
  import IHadithResource = HadithHouse.Services.IHadithResource;
  import IChainResource = HadithHouse.Services.IChainResource;
  import IEntityQueryResult = HadithHouse.Services.IEntityQueryResult;
  import IDialogService = angular.material.IDialogService;

  export class HadithPageCtrl extends EntityPageCtrl<IHadithResource> {
    oldHadith:IHadithResource;
    pagedChains:IEntityQueryResult<IChainResource & IResource<IChainResource>>;
    chainCopies:any;
    $mdDialog:IDialogService
    HadithResourceClass:Services.IHadithResourceClass;
    ChainResourceClass:Services.IChainResourceClass;

    constructor($scope:ng.IScope,
                $rootScope:ng.IScope,
                $location:ng.ILocationService,
                $routeParams:any,
                $mdDialog:IDialogService,
                HadithResourceClass:Services.IHadithResourceClass,
                ChainResourceClass:Services.IChainResourceClass,
                ToastService:any) {
      // Setting HadithResourceClass before calling super, because super might end up
      // calling methods which requires HadithResourceClass, e.g. newEntity().
      this.HadithResourceClass = HadithResourceClass;
      this.ChainResourceClass = ChainResourceClass;
      this.oldHadith = new this.HadithResourceClass({});
      this.$mdDialog = $mdDialog;
      this.chainCopies = {};
      super($scope, $rootScope, $location, $routeParams, HadithResourceClass, ToastService);
    }

    /**
     * Makes a copy of the data of the hadith in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyEntity() {
      this.oldHadith.text = this.entity.text;
      this.oldHadith.person = this.entity.person;
      this.oldHadith.book = this.entity.book;
      this.oldHadith.tags = this.entity.tags.slice();
    }

    /**
     * Restores the saved data of the hadith after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreEntity() {
      this.entity.text = this.oldHadith.text;
      this.entity.person = this.oldHadith.person;
      this.entity.book = this.oldHadith.book;
      this.entity.tags = this.oldHadith.tags.slice();
    }

    protected newEntity() : IHadithResource {
      return new this.HadithResourceClass({});
    }

    protected getEntityPath(id: number) {
      return 'hadith/' + id;
    }

    protected setOpeningExitingBookMode(id:string) {
      super.setOpeningExitingBookMode(id);
      // TODO: Use query() instead, as we always want to get all lists of chains and display them, because
      // I don't think there is going to be a very large number of chains for hadiths.
      this.pagedChains = this.ChainResourceClass.pagedQuery({hadith: id}, function(c) {
        c.isEditing = false;
        c.isAddingNew = false;
      });
    }

    /**
     * Makes a copy of the data of the hadith in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyChain(chain: IChainResource & IResource<IChainResource>) {
      this.chainCopies[chain.id] = {
        persons: chain.persons.slice()
      }
    }

    /**
     * Restores the saved data of the hadith after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreChain(chain: IChainResource & IResource<IChainResource>) {
      chain.persons = this.chainCopies[chain.id].persons.slice();
    }

    public startChainEditing(chain:any) {
      chain.isEditing = true;
      this.copyChain(chain);
    }

    public saveChain(chain:any) {
      this.ChainResourceClass.save(chain, (result) => {
        chain.isEditing = false;
        chain.isNew = false;
      }, (result) => {

      });
    }

    public cancelChainEditing(chain:any) {
      if (chain.isAddingNew) {
        // Item is not yet saved, just remove it.
        this.pagedChains.results = this.pagedChains.results.filter((c) => {
          return c != chain;
        });
      } else {
        chain.isEditing = false;
        this.restoreChain(chain);
      }
    }

    public addNewChain() {
      var chain = new this.ChainResourceClass();
      chain.hadith = this.entity.id;
      chain.isEditing = true;
      chain.isAddingNew = true;
      this.pagedChains.results.push(chain);
    }

    public deleteChain(event:any, chain:IChainResource) {

      var confirm = this.$mdDialog.confirm()
        .title('Confirm')
        .textContent('Are you sure you want to delete the chain?')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      this.$mdDialog.show(confirm).then(() => {
        this.ChainResourceClass.delete({id: chain.id}, () => {
          this.ToastService.show('Successfully deleted');
          this.pagedChains.results = this.pagedChains.results.filter((e) => {
            return e.id != chain.id;
          });
        }, (result) => {
          if (result.data && result.data.detail) {
            this.ToastService.show("Failed to delete chain. Error was: " + result.data.detail);
          } else if (result.data) {
            this.ToastService.show("Failed to delete chain. Error was: " + result.data);
          } else {
            this.ToastService.show("Failed to delete chain. Please try again!");
          }
        });
      });
    }
  }

  HadithHouse.HadithHouseApp.controller('HadithPageCtrl',
    function ($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResourceClass, ChainResourceClass, ToastService) {
      return new HadithPageCtrl($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResourceClass, ChainResourceClass, ToastService);
    });
}
