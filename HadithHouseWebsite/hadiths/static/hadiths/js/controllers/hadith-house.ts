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

import _ from "lodash";
import toastr from "toastr";
import angular, { ILocationService, IScope, IController } from "angular";

import { FacebookService } from "services/facebook.service";
import "directives/entity.directive";
import "directives/entity-lookup.directive";
import "directives/hadith-listing.directive";
import "directives/selector.directive";
import "directives/tags-input.directive";
import "directives/tree.directive";
import { UserResource } from "resources/resources";

declare function isFbLoginStatusFetched(): boolean;

declare function getFbAccessToken(): string;

declare function setFbAccessToken(token: string);

declare function isFbSdkLoaded(): boolean;

class MenuItem {
  public name: string;
  public urlPath: string;
  public selected: boolean;
  public description?: string;
}

export class HadithHouseCtrl implements IController {
  static $inject = ["$q", "$rootScope", "$location", "FacebookService",
    "UserResource"];
  private selected: MenuItem;
  private menuItems: MenuItem[];

  constructor(private $scope: IScope,
              private $rootScope: any,
              private $location: ILocationService,
              private facebookService: FacebookService,
              private userResource: UserResource) {

  }

  public $onInit(): void {
    this.$rootScope.isFbLoginStatusFetched = isFbLoginStatusFetched;
    this.$rootScope.fbUser = null;
    this.$rootScope.fbAccessToken = getFbAccessToken();


    this.getUserInfo();

    // Load all registered items
    this.menuItems = [
      {name: "Hadiths", urlPath: "hadiths", selected: false},
      {name: "Books", urlPath: "books", selected: false},
      {
        name: "Persons",
        urlPath: "persons",
        selected: false,
        description: "This page contains a listing of all the persons added " +
        "to the database of Hadith House."
      },
      {name: "Tags", urlPath: "hadithtags", selected: false},
      {name: "Users", urlPath: "users", selected: false}
    ];

    const path = this.$location.path() ? this.$location.path().substr(1) : null;
    if (path) {
      for (const menuItem of this.menuItems) {
        if (menuItem.urlPath === path) {
          this.selected = menuItem;
          break;
        }
      }
    }
    if (!this.selected) {
      this.selected = this.menuItems[0];
    }
  }

  public fbLogin(): void {
    if (!isFbSdkLoaded()) {
      toastr.error("Cannot login because Facebook SDK couldn't be loaded." +
        " This is most probably due to a plugin in your browser, e.g. " +
        "AdBlocker or Ghostery, blocking requests to social websites. " +
        "Disable blocking for this website and try again.");
      return;
    }
    this.facebookService.login().then((response) => {
      if (response.status === "connected") {
        this.$rootScope.fbAccessToken = response.authResponse.accessToken;
        setFbAccessToken(response.authResponse.accessToken);
        this.getUserInfo();
      }
    }, (reason) => {
      console.error("Failed to login to Facebook. Reason: " + reason);
    });
  }

  public getUserInfo(): void {
    if (!isFbSdkLoaded()) {
      // Facebook SDK couldn't be loaded, so we set the fbUser to null.
      this.$rootScope.fbUser = null;
      return;
    }
    this.facebookService.getLoggedInUser().then(function (user) {
      this.$rootScope.isFbLoginStatusFetched = true;
      if (user === null) {
        this.$rootScope.fbUser = null;
      } else {
        this.$rootScope.fbUser = {
          id: user.id,
          link: user.link,
          profilePicUrl: user.picture.data.url
        };
      }
    }, function onError(reason) {
      console.error("Failed to fetch logged in user. Reason: " +
        JSON.stringify(reason));
    });
    const currentUser = this.userResource.get("current", true);
    currentUser.promise.then(() => {
      const perms = {};
      for (const i in currentUser.permissions) {
        if (currentUser.permissions.hasOwnProperty(i)) {
          perms[currentUser.permissions[i]] = true;
        }
      }
      const user: any = {};
      angular.copy(currentUser, user);
      user.permissions = perms;
      this.$rootScope.user = user;
    });
  }

  public fbLogout(): void {
    this.facebookService.logout().then(function (/*response*/) {
      this.$rootScope.fbUser = null;
      this.$rootScope.fbAccessToken = null;
    });
  }

  public search(): void {
    toastr.warning("Search is not implemented yet!");
  }

  public selectMenuItem(item): void {
    _.each(this.menuItems, (i) => i.selected = false);
    this.selected = angular.isNumber(item) ? this.menuItems[item] : item;
    this.$location.url(this.selected.urlPath);
  }
}
