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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="../directives/tree.directive.ts" />
/// <reference path="entity-page.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var ChainTreeNodeArray = (function () {
            function ChainTreeNodeArray() {
                this.nodeDict = {};
                this.nodes = [];
            }
            ChainTreeNodeArray.prototype.add = function (node) {
                if (this.nodeDict[node.id]) {
                    // It is already added.
                    return;
                }
                this.nodes.push(node);
                this.nodeDict[node.id] = node;
            };
            ChainTreeNodeArray.prototype.get = function (id) {
                return this.nodeDict[id] || null;
            };
            return ChainTreeNodeArray;
        })();
        var ChainTreeNode = (function () {
            function ChainTreeNode() {
            }
            ChainTreeNode.create = function (rootPersonId, chains, personsDict) {
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
                        var personId = chains[j].persons[i];
                        var parentPersonId;
                        if (i == 0) {
                            parentPersonId = rootPersonId;
                        }
                        else {
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
                        n.children.forEach(function (c) {
                            stack.push(c);
                        });
                    }
                }
                return rootNode;
            };
            return ChainTreeNode;
        })();
        var HadithPageCtrl = (function (_super) {
            __extends(HadithPageCtrl, _super);
            function HadithPageCtrl($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResourceClass, PersonResourceClass, ChainResourceClass, ToastService) {
                // Setting HadithResourceClass before calling super, because super might end up
                // calling methods which requires HadithResourceClass, e.g. newEntity().
                this.HadithResourceClass = HadithResourceClass;
                this.PersonResourceClass = PersonResourceClass;
                this.ChainResourceClass = ChainResourceClass;
                this.oldHadith = new this.HadithResourceClass({});
                this.$mdDialog = $mdDialog;
                this.chainCopies = {};
                _super.call(this, $scope, $rootScope, $location, $routeParams, HadithResourceClass, ToastService);
            }
            /**
             * Makes a copy of the data of the hadith in case we have to restore them
             * if the user cancels editing or we fail to send changes to the server.
             */
            HadithPageCtrl.prototype.copyEntity = function () {
                this.oldHadith.text = this.entity.text;
                this.oldHadith.person = this.entity.person;
                this.oldHadith.book = this.entity.book;
                this.oldHadith.tags = this.entity.tags.slice();
            };
            /**
             * Restores the saved data of the hadith after the user cancels editing
             * or we fail to send changes to the server.
             */
            HadithPageCtrl.prototype.restoreEntity = function () {
                this.entity.text = this.oldHadith.text;
                this.entity.person = this.oldHadith.person;
                this.entity.book = this.oldHadith.book;
                this.entity.tags = this.oldHadith.tags.slice();
            };
            HadithPageCtrl.prototype.newEntity = function () {
                return new this.HadithResourceClass({});
            };
            HadithPageCtrl.prototype.getEntityPath = function (id) {
                return 'hadith/' + id;
            };
            HadithPageCtrl.prototype.setOpeningExistingEntityMode = function (id) {
                var _this = this;
                _super.prototype.setOpeningExistingEntityMode.call(this, id);
                // TODO: Use query() instead, as we always want to get all lists of chains and display them, because
                // I don't think there is going to be a very large number of chains for hadiths.
                this.pagedChains = this.ChainResourceClass.pagedQuery({ hadith: id }, function () {
                    _this.pagedChains.results.forEach(function (c) {
                        c.isEditing = false;
                        c.isAddingNew = false;
                    });
                    _this.buildChainTree();
                });
            };
            /**
             * Makes a copy of the data of the hadith in case we have to restore them
             * if the user cancels editing or we fail to send changes to the server.
             */
            HadithPageCtrl.prototype.copyChain = function (chain) {
                this.chainCopies[chain.id] = {
                    persons: chain.persons.slice()
                };
            };
            /**
             * Restores the saved data of the hadith after the user cancels editing
             * or we fail to send changes to the server.
             */
            HadithPageCtrl.prototype.restoreChain = function (chain) {
                chain.persons = this.chainCopies[chain.id].persons.slice();
            };
            HadithPageCtrl.prototype.startChainEditing = function (chain) {
                chain.isEditing = true;
                this.copyChain(chain);
            };
            HadithPageCtrl.prototype.saveChain = function (chain) {
                this.ChainResourceClass.save(chain, function () {
                    chain.isEditing = false;
                    chain.isNew = false;
                }, function () {
                });
            };
            HadithPageCtrl.prototype.cancelChainEditing = function (chain) {
                if (chain.isAddingNew) {
                    // Item is not yet saved, just remove it.
                    this.pagedChains.results = this.pagedChains.results.filter(function (c) {
                        return c != chain;
                    });
                }
                else {
                    chain.isEditing = false;
                    this.restoreChain(chain);
                }
            };
            HadithPageCtrl.prototype.addNewChain = function () {
                var chain = new this.ChainResourceClass();
                chain.hadith = this.entity.id;
                chain.isEditing = true;
                chain.isAddingNew = true;
                this.pagedChains.results.push(chain);
            };
            HadithPageCtrl.prototype.deleteChain = function (event, chain) {
                var _this = this;
                var confirm = this.$mdDialog.confirm()
                    .title('Confirm')
                    .textContent('Are you sure you want to delete the chain?')
                    .ok('Yes')
                    .cancel('No')
                    .targetEvent(event);
                this.$mdDialog.show(confirm).then(function () {
                    _this.ChainResourceClass.delete({ id: chain.id }, function () {
                        _this.ToastService.show('Successfully deleted');
                        _this.pagedChains.results = _this.pagedChains.results.filter(function (e) {
                            return e.id != chain.id;
                        });
                    }, function (result) {
                        if (result.data && result.data.detail) {
                            _this.ToastService.show("Failed to delete chain. Error was: " + result.data.detail);
                        }
                        else if (result.data) {
                            _this.ToastService.show("Failed to delete chain. Error was: " + result.data);
                        }
                        else {
                            _this.ToastService.show("Failed to delete chain. Please try again!");
                        }
                    });
                });
            };
            HadithPageCtrl.prototype.buildChainTree = function () {
                var _this = this;
                // Find the IDs of all persons in all chains to make a single request to
                // fetch their names.
                var allPersons = [this.entity.person];
                this.pagedChains.results.forEach(function (chain) {
                    allPersons = allPersons.concat(chain.persons);
                });
                allPersons = _.uniq(allPersons);
                // Fetch details
                // TODO: We should do this request early and cache it so that selector
                // directives won't need to fetch them again.
                this.PersonResourceClass.query({ ids: allPersons.join(',') }, function (persons) {
                    var personDict = {};
                    persons.forEach(function (p) {
                        personDict[p.id] = p;
                    });
                    _this.rootNode = ChainTreeNode.create(_this.entity.person, _this.pagedChains.results, personDict);
                });
            };
            return HadithPageCtrl;
        })(Controllers.EntityPageCtrl);
        Controllers.HadithPageCtrl = HadithPageCtrl;
        HadithHouse.HadithHouseApp.controller('HadithPageCtrl', function ($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResourceClass, PersonResourceClass, ChainResourceClass, ToastService) {
            return new HadithPageCtrl($scope, $rootScope, $location, $routeParams, $mdDialog, HadithResourceClass, PersonResourceClass, ChainResourceClass, ToastService);
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=hadith-page.js.map