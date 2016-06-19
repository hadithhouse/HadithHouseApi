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
/// <reference path="../app.ts" />
var HadithHouse;
(function (HadithHouse) {
    var Services;
    (function (Services) {
        var FacebookService = (function () {
            function FacebookService($q, FB, fbUserId) {
                this.$q = $q;
                this.FB = FB;
                this.fbUserId = fbUserId;
            }
            FacebookService.prototype.login = function () {
                var deferred = this.$q.defer();
                this.FB.login(function (response) {
                    if (response.authResponse) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject('User cancelled login');
                    }
                });
                return deferred.promise;
            };
            FacebookService.prototype.logout = function () {
                var deferred = this.$q.defer();
                this.FB.logout(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            };
            FacebookService.prototype.getLoginStatus = function () {
                var deferred = this.$q.defer();
                this.FB.getLoginStatus(function (response) {
                    deferred.resolve(response);
                });
                return deferred.promise;
            };
            /**
             * Makes an FB request to retrieve information about the current
             * logged in user.
             * @returns A promise resolving to the user info object.
             */
            FacebookService.prototype.getLoggedInUser = function () {
                var deferred = this.$q.defer();
                this.FB.api('/me', { fields: 'link,picture' }, function (user) {
                    deferred.resolve(user);
                });
                return deferred.promise;
            };
            FacebookService.prototype.getProfilePictureUrl = function (userId) {
                var deferred = this.$q.defer();
                this.FB.api('/' + this.fbUserId + '/picture', function (response) {
                    if (response && !response.error) {
                        deferred.resolve(response.data.url);
                    }
                    else {
                        deferred.reject(null);
                    }
                });
                return deferred.promise;
            };
            FacebookService.prototype.getUserFriends = function (userId) {
                var deferred = this.$q.defer();
                this.FB.api('/' + this.fbUserId + '/friends', function (response) {
                    if (response && !response.error) {
                        deferred.resolve(response.data.url);
                    }
                    else {
                        deferred.reject(null);
                    }
                });
                return deferred.promise;
            };
            return FacebookService;
        }());
        Services.FacebookService = FacebookService;
        HadithHouse.HadithHouseApp.factory('FacebookService', function ($q) {
            var fbUserId = window['fbUserId'];
            var FB = window['FB'];
            return new FacebookService($q, FB, fbUserId);
        });
    })(Services = HadithHouse.Services || (HadithHouse.Services = {}));
})(HadithHouse || (HadithHouse = {}));
//# sourceMappingURL=facebook.service.js.map