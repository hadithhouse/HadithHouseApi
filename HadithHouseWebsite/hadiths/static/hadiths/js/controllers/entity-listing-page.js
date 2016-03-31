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
/// <reference path="../resources/resources.ts" />
/// <reference path="entity-page.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var EntityListingPageCtrl = (function () {
            function EntityListingPageCtrl($scope, $rootScope, $timeout, $location, $mdDialog, EntityResource, ToastService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.$location = $location;
                this.$mdDialog = $mdDialog;
                this.EntityResource = EntityResource;
                this.ToastService = ToastService;
                this.searchPromise = null;
                this.page = 1;
                this.pageSize = 10;
                this.deleteEntity = function (event, entity) {
                    var confirm = _this.$mdDialog.confirm()
                        .title('Confirm')
                        .textContent('Are you sure you want to delete the entity?')
                        .ok('Yes')
                        .cancel('No')
                        .targetEvent(event);
                    _this.$mdDialog.show(confirm).then(function () {
                        entity.delete().then(function () {
                            _this.ToastService.show('Successfully deleted');
                            _this.pagedEntities.results = _this.pagedEntities.results.filter(function (e) {
                                return e.id != entity.id;
                            });
                        }, function (result) {
                            if (result.data && result.data.detail) {
                                _this.ToastService.show("Failed to delete entity. Error was: " + result.data.detail);
                            }
                            else if (result.data) {
                                _this.ToastService.show("Failed to delete entity. Error was: " + result.data);
                            }
                            else {
                                _this.ToastService.show("Failed to delete entity. Please try again!");
                            }
                        });
                    });
                };
                var urlParams = $location.search();
                this.page = parseInt(urlParams['page']) || 1;
                this.searchQuery = urlParams['search'] || '';
                this.loadEntities();
                $scope.$watch(function () { return _this.searchQuery; }, function (newValue, oldValue) {
                    if (newValue == oldValue) {
                        return;
                    }
                    if (_this.searchPromise != null) {
                        $timeout.cancel(_this.searchPromise);
                    }
                    _this.page = 1;
                    _this.searchPromise = $timeout(function () {
                        _this.loadEntities();
                    }, 250);
                });
                $scope.$watch(function () { return _this.page; }, function (newValue, oldValue) {
                    if (newValue == oldValue) {
                        return;
                    }
                    _this.loadEntities();
                });
            }
            EntityListingPageCtrl.prototype.loadEntities = function () {
                // TODO: Show an alert if an error happens.
                if (!this.searchQuery) {
                    this.pagedEntities = this.EntityResource.pagedQuery({
                        limit: this.pageSize,
                        offset: (this.page - 1) * this.pageSize
                    });
                }
                else {
                    this.pagedEntities = this.EntityResource.pagedQuery({
                        search: this.searchQuery,
                        limit: this.pageSize,
                        offset: (this.page - 1) * this.pageSize
                    });
                }
                if (typeof (this.page) === 'number' && this.page > 1) {
                    this.$location.search('page', this.page);
                }
                else {
                    this.$location.search('page', null);
                }
                if (this.searchQuery) {
                    this.$location.search('search', this.searchQuery);
                }
                else {
                    this.$location.search('search', null);
                }
            };
            EntityListingPageCtrl.prototype.range = function (n) {
                var res = [];
                for (var i = 0; i < n; i++) {
                    res.push(i + 1);
                }
                return res;
            };
            EntityListingPageCtrl.prototype.getPageCount = function () {
                if (this.pagedEntities) {
                    return Math.ceil(this.pagedEntities.count / this.pageSize);
                }
                return 0;
            };
            EntityListingPageCtrl.prototype.setPage = function (index) {
                this.page = index;
            };
            return EntityListingPageCtrl;
        }());
        Controllers.EntityListingPageCtrl = EntityListingPageCtrl;
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=entity-listing-page.js.map