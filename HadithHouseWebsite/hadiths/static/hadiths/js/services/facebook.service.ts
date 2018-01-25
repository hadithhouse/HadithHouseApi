/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Rafid Khalid Al-Humaimidi
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

import { IPromise, IQService } from "angular";

declare function getFbAccessToken(): string;

declare function isFbSdkLoaded(): boolean;

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    FB: any;
    fbUserId: any;
  }
}

export class FacebookUser {
  public id: Number;
  public link: string;
  public picture: { data: { url: string } };
}

export class FacebookService {
  private fbUserId: number;
  private $q: IQService;
  private FB: any;

  static $inject = ["$q"];

  constructor($q: IQService) {
    this.$q = $q;
    if (isFbSdkLoaded()) {
      this.FB = window.FB;
      this.fbUserId = window.fbUserId;
    } else {
      this.FB = null;
      this.fbUserId = null;
    }
  }

  private static verifyFacebookSdkLoaded(): void {
    if (!isFbSdkLoaded()) {
      throw new Error("Cannot login because Facebook SDK couldn't be loaded. " +
        "This is most probably due to a plugin in your browser, e.g. " +
        "AdBlocker or Ghostery, blocking requests to social websites. " +
        "Disable blocking for this website and try again.");
    }
  }

  public login(): any {
    FacebookService.verifyFacebookSdkLoaded();

    const deferred = this.$q.defer();
    this.FB.login((response) => {
      if (response.authResponse) {
        deferred.resolve(response);
      } else {
        deferred.reject("User cancelled login");
      }
    }, (reason) => {
      deferred.reject(reason);
    });
    return deferred.promise;
  }

  public logout() {
    FacebookService.verifyFacebookSdkLoaded();

    const deferred = this.$q.defer();
    this.FB.logout((response) => {
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  public getLoginStatus() {
    FacebookService.verifyFacebookSdkLoaded();

    const deferred = this.$q.defer();
    this.FB.getLoginStatus((response) => {
      deferred.resolve(response);
    });
    return deferred.promise;
  }

  /**
   * Makes an FB request to retrieve information about the current
   * logged in user.
   * @returns A promise resolving to the user info object.
   */
  public getLoggedInUser(): IPromise<FacebookUser> {
    FacebookService.verifyFacebookSdkLoaded();

    const deferred = this.$q.defer();
    if (getFbAccessToken() === null) {
      // No access token, so user is not logged in.
      deferred.resolve(null);
      return <IPromise<FacebookUser>>deferred.promise;
    }
    this.FB.api("/me", {fields: "link,picture"},
      (response) => {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response);
        }
      }
    );
    return <IPromise<FacebookUser>>deferred.promise;
  }

  public getProfilePictureUrl(userId) {
    FacebookService.verifyFacebookSdkLoaded();

    const deferred = this.$q.defer();
    this.FB.api("/" + this.fbUserId + "/picture",
      (response) => {
        if (response && !response.error) {
          deferred.resolve(response.data.url);
        } else {
          deferred.reject(null);
        }
      }
    );
    return deferred.promise;
  }

  public getUserFriends(userId) {
    FacebookService.verifyFacebookSdkLoaded();

    const deferred = this.$q.defer();
    this.FB.api("/" + this.fbUserId + "/friends",
      (response) => {
        if (response && !response.error) {
          deferred.resolve(response.data.url);
        } else {
          deferred.reject(null);
        }
      }
    );
    return deferred.promise;
  }
}

