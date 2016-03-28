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
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var EntityPageCtrl = (function () {
            function EntityPageCtrl($scope, $rootScope, $location, $routeParams, EntityResource, ToastService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.$routeParams = $routeParams;
                this.EntityResource = EntityResource;
                this.ToastService = ToastService;
                this.onKeyUp = function (e) {
                    if (e.keyCode === 27) {
                        console.log('test');
                        _this.cancelEditing();
                        _this.$scope.$apply();
                    }
                };
                /**
                 * Called when the user clicks on the save icon to save the changes made.
                 */
                this.finishEditing = function () {
                    // Send the changes to the server.
                    _this.entity.save().then(function (result) {
                        if (_this.isAddingNew) {
                            _this.$location.path(_this.getEntityPath(_this.entity.id));
                        }
                        // Successfully saved changes. Don't need to do anything.
                        _this.isEditing = false;
                        _this.isAddingNew = false;
                        _this.ToastService.show("Successful.");
                    }, function (result) {
                        if (result.data) {
                            _this.ToastService.showDjangoError("Failed to save changes. Error was: ", result.data);
                        }
                        else {
                            _this.ToastService.show("Failed to save changes. Please try again.");
                        }
                    });
                };
                this.error = null;
                this.entityCopy = EntityResource.create();
            }
            EntityPageCtrl.prototype.initialize = function () {
                var _this = this;
                if (this.$routeParams.id === 'new') {
                    this.setAddingNewEntityMode();
                }
                else {
                    var id = parseInt(this.$routeParams.id);
                    if (isNaN(id)) {
                        this.error = "'" + this.$routeParams.id + "' is not a valid ID!";
                        return;
                    }
                    this.setOpeningExistingEntityMode(id);
                }
                $(document).on('keyup', this.onKeyUp);
                this.$scope.$on('$destroy', function () {
                    $(document).off('keyup', _this.onKeyUp);
                });
            };
            /**
             * Makes a copy of the data of the entity in case we have to restore them
             * if the user cancels editing or we fail to send changes to the server.
             */
            EntityPageCtrl.prototype.copyEntity = function () {
                this.entityCopy.set(this.entity);
            };
            /**
             * Restores the saved data of the entity after the user cancels editing
             * or we fail to send changes to the server.
             */
            EntityPageCtrl.prototype.restoreEntity = function () {
                this.entity.set(this.entityCopy);
            };
            EntityPageCtrl.prototype.newEntity = function () {
                return this.EntityResource.create();
            };
            EntityPageCtrl.prototype.onEntityLoaded = function () {
            };
            EntityPageCtrl.prototype.setAddingNewEntityMode = function () {
                this.entity = this.newEntity();
                this.isAddingNew = true;
                this.isEditing = true;
            };
            EntityPageCtrl.prototype.setOpeningExistingEntityMode = function (id) {
                var _this = this;
                this.entity = this.EntityResource.get(id);
                this.entity.promise.then(function () {
                    _this.onEntityLoaded();
                });
                this.isAddingNew = false;
                this.isEditing = false;
            };
            /**
             * Called when the user clicks on the edit icon to start editing the entity.
             */
            EntityPageCtrl.prototype.startEditing = function () {
                this.copyEntity();
                this.isEditing = true;
            };
            /**
             * Called when the user clicks on the X icon to cancel the changes made.
             */
            EntityPageCtrl.prototype.cancelEditing = function () {
                if (this.isEditing) {
                    this.isEditing = false;
                    this.restoreEntity();
                }
            };
            ;
            return EntityPageCtrl;
        }());
        Controllers.EntityPageCtrl = EntityPageCtrl;
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=entity-page.js.map