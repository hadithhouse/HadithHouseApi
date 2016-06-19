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
var HadithHouse;
(function (HadithHouse) {
    var Services;
    (function (Services) {
        var ToastService = (function () {
            function ToastService($mdToast) {
                this.$mdToast = $mdToast;
            }
            // TODO: Add a method for displaying error toasts.
            /**
             * Shows a test with the given message.
             * @param message The message to show.
             * @param delay The time in milliseconds to show the toast for.
             */
            ToastService.prototype.show = function (message, delay) {
                if (delay === void 0) { delay = null; }
                if (!delay) {
                    delay = 10000;
                }
                this.$mdToast.show(this.$mdToast.simple()
                    .textContent(message)
                    .position(this.getToastPosition())
                    .hideDelay(delay));
            };
            /**
             * Shows an error coming from a Django API.
             * @param message The message to show.
             * @param result Django API's result.
             */
            ToastService.prototype.showDjangoError = function (message, result) {
                message += '\n';
                _.each(result, function (errors, fieldName) {
                    message += fieldName;
                    message += ': ';
                    message += errors.join(', ');
                    message += '\n';
                });
                this.show(message);
            };
            ToastService.prototype.getToastPosition = function () {
                var toastPosition = {
                    bottom: false,
                    left: false,
                    right: true,
                    top: true
                };
                return Object.keys(toastPosition)
                    .filter(function (pos) {
                    return toastPosition[pos];
                }).join(' ');
            };
            return ToastService;
        }());
        Services.ToastService = ToastService;
        HadithHouse.HadithHouseApp.factory('ToastService', function ($mdToast) {
            return new ToastService($mdToast);
        });
    })(Services = HadithHouse.Services || (HadithHouse.Services = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=toast.service.js.map