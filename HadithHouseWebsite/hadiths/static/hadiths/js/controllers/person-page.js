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
/// <reference path="../app.ts" />
/// <reference path="../services/services.ts" />
/// <reference path="entity-page.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Controllers;
    (function (Controllers) {
        var PersonPageCtrl = (function (_super) {
            __extends(PersonPageCtrl, _super);
            function PersonPageCtrl($scope, $rootScope, $location, $routeParams, PersonResource, ToastService) {
                _super.call(this, $scope, $rootScope, $location, $routeParams, PersonResource, ToastService);
                this.PersonResource = PersonResource;
                this.oldPerson = new this.PersonResource({});
            }
            /**
             * Makes a copy of the data of the person in case we have to restore them
             * if the user cancels editing or we fail to send changes to the server.
             */
            PersonPageCtrl.prototype.copyEntity = function () {
                this.oldPerson.title = this.entity.title;
                this.oldPerson.display_name = this.entity.display_name;
                this.oldPerson.full_name = this.entity.full_name;
                this.oldPerson.brief_desc = this.entity.brief_desc;
                this.oldPerson.birth_year = this.entity.birth_year;
                this.oldPerson.birth_month = this.entity.birth_month;
                this.oldPerson.birth_day = this.entity.birth_day;
                this.oldPerson.death_year = this.entity.death_year;
                this.oldPerson.death_month = this.entity.death_month;
                this.oldPerson.death_day = this.entity.death_day;
            };
            /**
             * Restores the saved data of the person after the user cancels editing
             * or we fail to send changes to the server.
             */
            PersonPageCtrl.prototype.restoreEntity = function () {
                this.entity.title = this.oldPerson.title;
                this.entity.display_name = this.oldPerson.display_name;
                this.entity.full_name = this.oldPerson.full_name;
                this.entity.brief_desc = this.oldPerson.brief_desc;
                this.entity.birth_year = this.oldPerson.birth_year;
                this.entity.birth_month = this.oldPerson.birth_month;
                this.entity.birth_day = this.oldPerson.birth_day;
                this.entity.death_year = this.oldPerson.death_year;
                this.entity.death_month = this.oldPerson.death_month;
                this.entity.death_day = this.oldPerson.death_day;
            };
            PersonPageCtrl.prototype.newEntity = function () {
                return new this.PersonResource({});
            };
            return PersonPageCtrl;
        })(Controllers.EntityPageCtrl);
        Controllers.PersonPageCtrl = PersonPageCtrl;
        HadithHouse.HadithHouseApp.controller('PersonPageCtrl', function ($scope, $rootScope, $location, $routeParams, PersonResource, ToastService) {
            return new PersonPageCtrl($scope, $rootScope, $location, $routeParams, PersonResource, ToastService);
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=person-page.js.map