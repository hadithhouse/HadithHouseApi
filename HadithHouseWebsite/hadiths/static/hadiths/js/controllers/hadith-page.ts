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

import _ from "lodash"
import toastr from "toastr";
import {HadithHouseApp} from "app-def";
import {
  Book, CacheableResource, Chain, Hadith, HadithTag, ObjectWithPromise, PagedResults, Person
} from "../resources/resources";
import {EntityPageCtrl} from "./entity-page";
import {ILocationService, IScope} from "angular";
import {ITreeNode} from "../directives/tree.directive";

class ChainTreeNode {
  public id: string;
  public name: string;
  public _children: ChainTreeNode[];
  public children: ChainTreeNode[];

  public static create(rootPersonId: number,
                       chains: Chain[],
                       personsDict: any): ITreeNode {
    let previousLevel: ChainTreeNode[] = [];
    let rootNode = new ChainTreeNode();
    rootNode.id = rootPersonId.toString();
    rootNode.name = personsDict[rootPersonId].display_name || personsDict[rootPersonId].full_name;
    rootNode._children = [];
    rootNode.children = [];
    ChainTreeNode.addUniqueElementToArray(previousLevel, rootNode);

    let finished = false;
    for (let i = 0; !finished; i++) {
      let currentLevel: ChainTreeNode[] = [];
      finished = true;
      for (let j = 0; j < chains.length; j++) {
        // Does this chain have any person at and beyond this level?
        if (chains[j].persons.length <= i) {
          continue;
        }
        finished = false;
        let personId: number = chains[j].persons[i];
        let parentPersonId: number;
        if (i === 0) {
          parentPersonId = rootPersonId;
        } else {
          parentPersonId = chains[j].persons[i - 1];
        }

        let node = new ChainTreeNode();
        node.id = personId.toString();
        node.name = personsDict[personId].full_name;
        node._children = [];
        node.children = [];
        ChainTreeNode.addUniqueElementToArray(
          _.find(previousLevel, (e) => e.id === parentPersonId.toString()).children, node);
        ChainTreeNode.addUniqueElementToArray(currentLevel, node);
      }
      previousLevel = currentLevel;
    }

    let stack = [rootNode];
    while (stack.length > 0) {
      let n = stack.pop();
      delete n.id;
      if (n.children) {
        n.children.forEach((c) => {
          stack.push(c);
        });
      }
    }

    return rootNode;
  }

  private static addUniqueElementToArray<T extends { id }>(array: T[], element: T) {
    if (_.find(array, (e) => {
        return e.id === element.id;
      })) {
      return;
    }
    array.push(element);
  }
}

export class HadithPageCtrl extends EntityPageCtrl<Hadith> {
  public tagsExpanded: HadithTag[];
  public bookExpanded: Book[];
  public personExpanded: Person[];
  public pagedChains: ObjectWithPromise<PagedResults<Chain>>;
  public chainCopies: any;
  public HadithResource: CacheableResource<Hadith, number | string>;
  public HadithTagResource: CacheableResource<HadithTag, number>;
  public BookResource: CacheableResource<Book, number>;
  public PersonResource: CacheableResource<Person, number>;
  public ChainResource: CacheableResource<Chain, number>;
  public rootNode: any;
  public chainToDelete: Chain;

  constructor($scope: IScope,
              $rootScope: IScope,
              $location: ILocationService,
              $routeParams: any,
              HadithResource: CacheableResource<Hadith, number | string>,
              HadithTagResource: CacheableResource<HadithTag, number>,
              BookResource: CacheableResource<Book, number>,
              PersonResource: CacheableResource<Person, number>,
              ChainResource: CacheableResource<Chain, number>) {
    super($scope, $rootScope, $location, $routeParams, HadithResource);
    this.HadithResource = HadithResource;
    this.HadithTagResource = HadithTagResource;
    this.BookResource = BookResource;
    this.PersonResource = PersonResource;
    this.ChainResource = ChainResource;
    this.chainCopies = {};
    this.rootNode = null;
  }

  protected getEntityPath(id: number) {
    return 'hadith/' + id;
  }

  protected onEntityLoaded() {
    this.tagsExpanded = this.HadithTagResource.get(this.entity.tags);
    if (this.entity.person) {
      this.personExpanded = this.PersonResource.get([this.entity.person]);
    } else {
      this.personExpanded = null;
    }
    if (this.entity.book) {
      this.bookExpanded = this.BookResource.get([this.entity.book]);
    } else {
      this.bookExpanded = null;
    }
  }

  protected beforeSave(): boolean {
    this.entity.tags = this.tagsExpanded.map(t => t.id);
    if (!this.personExpanded || this.personExpanded.length === 0) {
      this.entity.person = null;
    } else {
      this.entity.person = this.personExpanded[0].id;
    }
    if (!this.bookExpanded || this.bookExpanded.length === 0) {
      this.entity.book = null;
    } else {
      this.entity.book = this.bookExpanded[0].id;
    }
    return true;
  }

  protected setOpeningExistingEntityMode(id: number) {
    super.setOpeningExistingEntityMode(id);
    // TODO: Use query() instead, as we always want to get all lists of chains and display them, because
    // I don't think there is going to be a very large number of chains for hadiths.
    this.pagedChains = this.ChainResource.pagedQuery({hadith: id.toString()});
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
  protected copyChain(chain: Chain) {
    this.chainCopies[chain.id] = {
      persons: chain.persons.slice()
    };
  }

  /**
   * Restores the saved data of the hadith after the user cancels editing
   * or we fail to send changes to the server.
   */
  protected restoreChain(chain: Chain) {
    chain.persons = this.chainCopies[chain.id].persons.slice();
  }

  public startChainEditing(chain: any) {
    chain.personsExpanded = this.PersonResource.get(chain.persons);
    chain.isEditing = true;
    this.copyChain(chain);
  }

  // TODO: Either add the personsExpanded field to the Chain class, or -better- make the necessary changes to
  // hh-tags-input such that it requires only IDs so we don't have to expand it ourselves.
  public saveChain(chain: Chain & { personsExpanded: any }) {
    chain.persons = chain.personsExpanded.map(t => t.id);
    chain.save().then(() => {
      chain.isEditing = false;
      chain.isAddingNew = false;
    });
  }

  public cancelChainEditing(chain: Chain) {
    if (chain.isAddingNew) {
      // Item is not yet saved, just remove it.
      this.pagedChains.results = this.pagedChains.results.filter((c) => {
        return c !== chain;
      });
    } else {
      chain.isEditing = false;
      this.restoreChain(chain);
    }
  }

  public addNewChain() {
    let chain = this.ChainResource.create();
    chain.hadith = this.entity.id;
    chain.isEditing = true;
    chain.isAddingNew = true;
    this.pagedChains.results.push(chain);
  }

  public showDeleteChainDialog = (chain: Chain) => {
    this.chainToDelete = chain;
    // modal() is defined in bootstrap but I don't have @types for it so costing to type 'any' to stop
    // tsc compiler errors.
    (<any>$('#deleteChainConfirmDialog')).modal('show');
  };

  public deleteChain = () => {
    // modal() is defined in bootstrap but I don't have @types for it so costing to type 'any' to stop
    // tsc compiler errors.
    (<any>$('#deleteChainConfirmDialog')).modal('hide');
    this.chainToDelete.delete().then(() => {
      toastr.success('Chain deleted');
      this.pagedChains.results = this.pagedChains.results.filter((e) => {
        return e.id !== this.chainToDelete.id;
      });
      this.chainToDelete = null;
    }, (result) => {
      if (result.data && result.data.detail) {
        toastr.error('Failed to delete chain. Error was: ' + result.data.detail);
      } else if (result.data) {
        toastr.error('Failed to delete chain. Error was: ' + result.data);
      } else {
        toastr.error('Failed to delete chain. Please try again!');
      }
    });
  };

  private buildChainTree() {
    if (!this.entity.person || this.pagedChains.results.length === 0) {
      // This hadith doesn't have a person, so there is not much point in
      // building a chain tree for it even if it has some chains.
      return;
    }
    // Find the IDs of all persons in all chains to make a single request to
    // fetch their names.
    let allPersons = [this.entity.person];
    this.pagedChains.results.forEach((chain) => {
      allPersons = allPersons.concat(chain.persons);
    });
    allPersons = _.uniq(allPersons);

    // Fetch details
    // TODO: We should do this request early and cache it so that selector
    // directives won't need to fetch them again.
    this.PersonResource.get(allPersons).promise.then((persons) => {
      let personDict = {};
      persons.forEach((p) => {
        personDict[p.id] = p;
      });

      this.rootNode = ChainTreeNode.create(this.entity.person, this.pagedChains.results, personDict);
    });
  }
}

export function HadithPageCtrlCreator($scope, $rootScope, $location, $routeParams, HadithResource, HadithTagResource,
                                      BookResource, PersonResource, ChainResource) {
  let ctrl = new HadithPageCtrl($scope, $rootScope, $location, $routeParams,
    HadithResource, HadithTagResource, BookResource, PersonResource, ChainResource);
  ctrl.initialize();
  return ctrl;
}

HadithHouseApp.controller('HadithPageCtrl', HadithPageCtrlCreator);
