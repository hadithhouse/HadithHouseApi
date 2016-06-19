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

module HadithHouse.Services {
  import IQService = angular.IQService;
  export class FacebookOfflineService {
    private $q:IQService;

    constructor($q:IQService) {
      this.$q = $q;
    }

    public login() {
      let deferred = this.$q.defer();
      deferred.reject('Not supported while offline');
      return deferred.promise;
    }

    public logout() {
      let deferred = this.$q.defer();
      deferred.reject('Not supported while offline');
      return deferred.promise;
    }

    public getLoginStatus() {
      throw 'Not implemented in the offline version of Facebook service';
    }

    /**
     * Makes an FB request to retrieve information about the current
     * logged in user.
     * @returns A promise resolving to the user info object.
     */
    public getLoggedInUser() {
      let deferred = this.$q.defer();
      let user = {
        'link': 'https://www.facebook.com/app_scoped_user_id/10152863219036905/',
        'picture': {
          'data': {
            'is_silhouette': false,
            'url': 'https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c12.0.50.50/p57x57/114…_8891337119643731696_n.jpg?oh=4541774c11459787bb5d9ad23d059770&oe=5798CB9E'
          }
        },
        'id': '10152863219036905'
      };
      deferred.resolve(user);
      return deferred.promise;
    }

    public getProfilePictureUrl(userId) {
      let deferred = this.$q.defer();
      deferred.resolve('https://scontent.xx.fbcdn.net/hprofile-xpa1/v/t1.0-1/c12.0.50.50/p57x57/114…_8891337119643731696_n.jpg?oh=4541774c11459787bb5d9ad23d059770&oe=5798CB9E');
      return deferred.promise;
    }

    public getUserFriends(userId) {
      throw 'Not implemented in the offline version of Facebook service';
    }
  }

  HadithHouse.HadithHouseApp.factory('FacebookService', function ($q) {
    return new FacebookOfflineService($q);
  });
}
