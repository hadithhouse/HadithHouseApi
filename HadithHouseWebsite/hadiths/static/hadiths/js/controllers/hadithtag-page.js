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
        var HadithTagPageCtrl = (function (_super) {
            __extends(HadithTagPageCtrl, _super);
            function HadithTagPageCtrl($scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService) {
                _super.call(this, $scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService);
                this.HadithTagResource = HadithTagResource;
            }
            HadithTagPageCtrl.prototype.getEntityPath = function (id) {
                return 'hadithtag/' + id;
            };
            return HadithTagPageCtrl;
        }(Controllers.EntityPageCtrl));
        Controllers.HadithTagPageCtrl = HadithTagPageCtrl;
        HadithHouse.HadithHouseApp.controller('HadithTagPageCtrl', function ($scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService) {
            var ctrl = new HadithTagPageCtrl($scope, $rootScope, $location, $routeParams, HadithTagResource, ToastService);
            ctrl.initialize();
            return ctrl;
        });
    })(Controllers = HadithHouse.Controllers || (HadithHouse.Controllers = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=hadithtag-page.js.map