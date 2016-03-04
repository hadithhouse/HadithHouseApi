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
/// <reference path="../../../../../TypeScriptDefs/lodash/lodash.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angularjs/angular.d.ts" />
/// <reference path="../../../../../TypeScriptDefs/angular-material/angular-material.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="entity-page.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var UserPageCtrl = (function (_super) {
            __extends(UserPageCtrl, _super);
            function UserPageCtrl($scope, $rootScope, $location, $routeParams, UserResource, ToastService) {
                // Setting UserResource before calling super, because super might end up
                // calling methods which requires UserResource, e.g. newEntity().
                this.UserResource = UserResource;
                this.oldUser = new this.UserResource({});
                _super.call(this, $scope, $rootScope, $location, $routeParams, UserResource, ToastService);
            }
            /**
             * Makes a copy of the data of the person in case we have to restore them
             * if the user cancels editing or we fail to send changes to the server.
             */
            UserPageCtrl.prototype.copyEntity = function () {
                this.oldUser.first_name = this.entity.first_name;
                this.oldUser.last_name = this.entity.last_name;
                this.oldUser.is_superuser = this.entity.is_superuser;
                this.oldUser.is_staff = this.entity.is_staff;
                this.oldUser.username = this.entity.username;
                this.oldUser.date_joined = this.entity.date_joined;
                this.oldUser.permissions = this.entity.permissions.slice();
            };
            /**
             * Restores the saved data of the person after the user cancels editing
             * or we fail to send changes to the server.
             */
            UserPageCtrl.prototype.restoreEntity = function () {
                this.entity.first_name = this.oldUser.first_name;
                this.entity.last_name = this.oldUser.last_name;
                this.entity.is_superuser = this.oldUser.is_superuser;
                this.entity.is_staff = this.oldUser.is_staff;
                this.entity.username = this.oldUser.username;
                this.entity.date_joined = this.oldUser.date_joined;
                this.entity.permissions = this.oldUser.permissions.slice();
            };
            UserPageCtrl.prototype.newEntity = function () {
                return new this.UserResource({});
            };
            UserPageCtrl.prototype.getEntityPath = function (id) {
                return 'user/' + id;
            };
            UserPageCtrl.prototype.onEntityLoaded = function () {
                this.entity.permissionsOrdered = _.sortBy(this.entity.permissions, function (a) {
                    var parts = a.split('_');
                    return parts[1] + "_" + parts[0];
                });
            };
            return UserPageCtrl;
        })(Controllers.EntityPageCtrl);
        Controllers.UserPageCtrl = UserPageCtrl;
        HadithHouse.HadithHouseApp.controller('UserPageCtrl', function ($scope, $rootScope, $location, $routeParams, UserResource, ToastService) {
            return new UserPageCtrl($scope, $rootScope, $location, $routeParams, UserResource, ToastService);
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=user-page.js.map