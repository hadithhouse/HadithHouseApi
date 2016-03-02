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

(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.factory('FacebookService', function ($q) {
    var fbUserId = window['fbUserId'];

    function login() {
      var deferred = $q.defer();
      deferred.reject('Not supported while offline');
      return deferred.promise;
    }

    function logout() {
      var deferred = $q.defer();
      deferred.reject('Not supported while offline');
      return deferred.promise;
    }

    function getLoginStatus() {
      throw 'Not implemented in the offline version of Facebook service'
    }

    /**
     * Makes an FB request to retrieve information about the current
     * logged in user.
     * @returns A promise resolving to the user info object.
     */
    function getLoggedInUser() {
      var deferred = $q.defer();
      var user = {
        "link": "https://www.facebook.com/app_scoped_user_id/10152863219036905/",
        "picture": {
          "data": {
            "is_silhouette": false,
            "url": "https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c12.0.50.50/p57x57/114…_8891337119643731696_n.jpg?oh=4541774c11459787bb5d9ad23d059770&oe=5798CB9E"
          }
        },
        "id": "10152863219036905"
      }
      deferred.resolve(user);
      return deferred.promise;
    }

    function getProfilePictureUrl(userId) {
      var deferred = $q.defer();
      deferred.resolve('https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c12.0.50.50/p57x57/114…_8891337119643731696_n.jpg?oh=4541774c11459787bb5d9ad23d059770&oe=5798CB9E');
      return deferred.promise;
    }

    function getUserFriends(userId) {
      throw 'Not implemented in the offline version of Facebook service'
    }

    return {
      login: login,
      logout: logout,
      getLoginStatus: getLoginStatus,
      getLoggedInUser: getLoggedInUser,
      getProfilePictureUrl: getProfilePictureUrl,
      getUserFriends: getUserFriends
    };
  });
}());
