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
/// <reference path="../resources/resources.ts" />
/// <reference path="../directives/tree.directive.ts" />
/// <reference path="entity-page.ts" />

module HadithHouse.Controllers {
  import IResource = angular.resource.IResource;
  import IDialogService = angular.material.IDialogService;
  import ITreeNode = HadithHouse.Directives.ITreeNode;
  import Hadith = HadithHouse.Resources.Hadith;
  import PagedResults = HadithHouse.Resources.PagedResults;
  import Chain = HadithHouse.Resources.Chain;
  import Person = HadithHouse.Resources.Person;
  import ObjectWithPromise = HadithHouse.Resources.ObjectWithPromise;

  class ChainTreeNodeArray {
    nodeDict:any = {};
    nodes:ChainTreeNode[] = [];

    public add(node:ITreeNode) {
      if (this.nodeDict[node.id]) {
        // It is already added.
        return;
      }
      this.nodes.push(node);
      this.nodeDict[node.id] = node;
    }

    public get(id:string) {
      return this.nodeDict[id] || null;
    }
  }

  class ChainTreeNode {
    public static create(rootPersonId:number,
                         chains:Chain[],
                         personsDict:any):ITreeNode {
      var previousLevel = new ChainTreeNodeArray();
      var rootNode = {
        id: rootPersonId.toString(),
        name: personsDict[rootPersonId].display_name || personsDict[rootPersonId].full_name,
        _children: [],
        children: []
      };
      previousLevel.add(rootNode);

      var finished = false;
      for (var i = 0; !finished; i++) {
        var currentLevel = new ChainTreeNodeArray();
        finished = true;
        for (var j = 0; j < chains.length; j++) {
          // Does this chain have any person at and beyond this level?
          if (chains[j].persons.length <= i) {
            continue;
          }
          finished = false;
          var personId:number = chains[j].persons[i];
          var parentPersonId:number;
          if (i == 0) {
            parentPersonId = rootPersonId;
          } else {
            parentPersonId = chains[j].persons[i - 1];
          }

          var node = {
            id: personId.toString(),
            name: personsDict[personId].full_name,
            _children: [],
            children: []
          };
          previousLevel.get(parentPersonId.toString()).children.push(node);
          currentLevel.add(node);
        }
        previousLevel = currentLevel;
      }

      var stack = [rootNode];
      while (stack.length > 0) {
        var n = stack.pop();
        delete n.id;
        if (n.children) {
          n.children.forEach((c) => {
            stack.push(c);
          });
        }
      }

      return rootNode;
    }
  }

  export class HadithPageCtrl extends EntityPageCtrl<Hadith> {
    pagedChains:ObjectWithPromise<PagedResults<Chain>>;
    chainCopies:any;
    $mdDialog:IDialogService;
    HadithResource:Resources.CacheableResource<Hadith>;
    PersonResource:Resources.CacheableResource<Person>;
    ChainResource:Resources.CacheableResource<Chain>;
    rootNode:any;

    constructor($scope:ng.IScope,
                $rootScope:ng.IScope,
                $location:ng.ILocationService,
                $routeParams:any,
                $mdDialog:IDialogService,
                HadithResource:Resources.CacheableResource<Hadith>,
                PersonResource:Resources.CacheableResource<Person>,
                ChainResource:Resources.CacheableResource<Chain>,
                ToastService:any) {
      super($scope, $rootScope, $location, $routeParams, HadithResource, ToastService);
      this.HadithResource = HadithResource;
      this.PersonResource = PersonResource;
      this.ChainResource = ChainResource;
      this.$mdDialog = $mdDialog;
      this.chainCopies = {};
    }

    protected getEntityPath(id:number) {
      return 'hadith/' + id;
    }

    protected setOpeningExistingEntityMode(id:number) {
      super.setOpeningExistingEntityMode(id);
      // TODO: Use query() instead, as we always want to get all lists of chains and display them, because
      // I don't think there is going to be a very large number of chains for hadiths.
      this.pagedChains = this.ChainResource.pagedQuery({hadith: id});
      this.pagedChains.promise.then(() => {
        this.pagedChains.results.forEach((c) => {
          c.isEditing = false;
          c.isAddingNew = false;
        });
        this.buildChainTree();
      });
    }

    /**
     * Makes a copy of the data of the hadith in case we have to restore them
     * if the user cancels editing or we fail to send changes to the server.
     */
    protected copyChain(chain:Chain) {
      this.chainCopies[chain.id] = {
        persons: chain.persons.slice()
      }
    }

    /**
     * Restores the saved data of the hadith after the user cancels editing
     * or we fail to send changes to the server.
     */
    protected restoreChain(chain:Chain) {
      chain.persons = this.chainCopies[chain.id].persons.slice();
    }

    public startChainEditing(chain:any) {
      chain.isEditing = true;
      this.copyChain(chain);
    }

    public saveChain(chain:Chain) {
      chain.save().then(() => {
        chain.isEditing = false;
        chain.isAddingNew = false;
      });
    }

    public cancelChainEditing(chain:Chain) {
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
      var chain = this.ChainResource.create();
      chain.hadith = this.entity.id;
      chain.isEditing = true;
      chain.isAddingNew = true;
      this.pagedChains.results.push(chain);
    }

    public deleteChain(event:any, chain:Chain) {
      var confirm = this.$mdDialog.confirm()
        .title('Confirm')
        .textContent('Are you sure you want to delete the chain?')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      this.$mdDialog.show(confirm).then(() => {
        chain.delete().then(() => {
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

    buildChainTree() {
      // Find the IDs of all persons in all chains to make a single request to
      // fetch their names.
      var allPersons = [this.entity.person];
      this.pagedChains.results.forEach((chain) => {
        allPersons = allPersons.concat(chain.persons);
      });
      allPersons = _.uniq(allPersons);

      // Fetch details
      // TODO: We should do this request early and cache it so that selector
      // directives won't need to fetch them again.
      this.PersonResource.get(allPersons).promise.then((persons) => {
        var personDict = {};
        persons.forEach((p) => {
          personDict[p.id] = p;
        });

        this.rootNode = ChainTreeNode.create(this.entity.person, this.pagedChains.results, personDict);
      });
    }
  }

  HadithHouse.HadithHouseApp.controller('HadithPageCtrl',
    function ($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResource, PersonResource, ChainResource, ToastService) {
      var ctrl = new HadithPageCtrl($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResource, PersonResource, ChainResource, ToastService);
      ctrl.initialize();
      return ctrl;
    });
}
