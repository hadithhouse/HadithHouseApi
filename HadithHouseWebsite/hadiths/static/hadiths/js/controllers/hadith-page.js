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
        var HadithPageCtrl = (function (_super) {
            __extends(HadithPageCtrl, _super);
            function HadithPageCtrl($scope, $rootScope, $location, $routeParams, HadithResourceClass, ChainResourceClass, ToastService) {
                // Setting HadithResourceClass before calling super, because super might end up
                // calling methods which requires HadithResourceClass, e.g. newEntity().
                this.HadithResourceClass = HadithResourceClass;
                this.ChainResourceClass = ChainResourceClass;
                this.oldHadith = new this.HadithResourceClass({});
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
            HadithPageCtrl.prototype.setOpeningExitingBookMode = function (id) {
                _super.prototype.setOpeningExitingBookMode.call(this, id);
                // TODO: Use query() instead, as we always want to get all lists of chains and display them, because
                // I don't think there is going to be a very large number of chains for hadiths.
                this.pagedChains = this.ChainResourceClass.pagedQuery({ hadith: id });
            };
            return HadithPageCtrl;
        })(Controllers.EntityPageCtrl);
        Controllers.HadithPageCtrl = HadithPageCtrl;
        HadithHouse.HadithHouseApp.controller('HadithPageCtrl', function ($scope, $rootScope, $location, $routeParams, HadithResourceClass, ChainResourceClass, ToastService) {
            return new HadithPageCtrl($scope, $rootScope, $location, $routeParams, HadithResourceClass, ChainResourceClass, ToastService);
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=hadith-page.js.map