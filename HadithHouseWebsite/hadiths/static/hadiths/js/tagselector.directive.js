/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Rafid K. Abdullah
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
  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('TagSelectorCtrl', function ($scope, TagsService) {
    var ctrl = this;

    if (!ctrl.tagNames) {
      ctrl.tagNames = [];
    }

    ctrl.availTagNames = [];
    ctrl.availTagsLoaded = false;
    TagsService.getTags().then(function onSuccess(tags) {
      ctrl.availTagsLoaded = true;
      ctrl.availTagNames = tags.map(function(tag) { return tag.name; });
    });

    ctrl.findTagNames = function (query) {
      if (!ctrl.availTagsLoaded) {
        return [];
      }

      return ctrl.availTagNames.filter(function (tagName) {
        return tagName.indexOf(query) > -1 && ctrl.tagNames.indexOf(tagName) == -1;
      });
    };
  });

  HadithHouseApp.directive('hhTagSelector', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: getHtmlBasePath() + 'tagselector.directive.html',
      controller: 'TagSelectorCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        tagNames: '=',
        readOnly: '='
      }
    };

  });
}());