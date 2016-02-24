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
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var EntityListingPageCtrl = (function () {
            function EntityListingPageCtrl($scope, $rootScope, $mdDialog, EntityResource, ToastService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$mdDialog = $mdDialog;
                this.EntityResource = EntityResource;
                this.ToastService = ToastService;
                this.deleteEntity = function (event, entity) {
                    var confirm = _this.$mdDialog.confirm()
                        .title('Confirm')
                        .textContent('Are you sure you want to delete the entity?')
                        .ok('Yes')
                        .cancel('No')
                        .targetEvent(event);
                    _this.$mdDialog.show(confirm).then(function () {
                        _this.EntityResource.delete({ id: entity.id }, function () {
                            _this.ToastService.show('Successfully deleted');
                            _this.entities = _this.entities.filter(function (e) { return e.id != entity.id; });
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
                this.loadEntities();
            }
            EntityListingPageCtrl.prototype.loadEntities = function () {
                // TODO: Show an alert if an error happens.
                this.entities = this.EntityResource.query();
            };
            return EntityListingPageCtrl;
        })();
        Controllers.EntityListingPageCtrl = EntityListingPageCtrl;
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=entity-listing-page.js.map