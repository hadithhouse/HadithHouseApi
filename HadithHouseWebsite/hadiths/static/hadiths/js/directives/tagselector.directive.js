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

  HadithHouseApp.controller('TagSelectorCtrl', function ($scope, $q, $mdDialog, HadithTag) {
    var ctrl = this;

    ctrl.singleSelect = false;

    if (ctrl.requireMatch === undefined) {
      ctrl.requireMatch = true;
    }

    if (!ctrl.tagNames) {
      ctrl.tagNames = [];
    }

    ctrl.availTagNames = [];
    ctrl.availTagsLoaded = false;

    /**
     * Used to load the available tags in the server for auto completion
     * purposes.
     */
    function loadAvailTags() {
      HadithTag.query(function onSuccess(tags) {
        ctrl.availTagsLoaded = true;
        ctrl.availTagNames = tags.map(function (tag) {
          return tag.name;
        });
      });
    }

    loadAvailTags();

    /**
     * Self explanatory. This is used when multi-select is not allowed, hence
     * whenever the user makes a new selection, we should remove the previous
     * selection.
     */
    function removeAllTagsButLast() {
      ctrl.tagNames.splice(0, ctrl.tagNames.length - 1);
    }

    $scope.$watchCollection(function () {
      return ctrl.tagNames;
    }, function () {
      if (ctrl.singleSelect === true && ctrl.tagNames && ctrl.tagNames.length > 1) {
        removeAllTagsButLast();
      }
    });

    /**
     * Called when the user is trying to use a tag that doesn't exist in the
     * database and thus we should create it for him/her.
     * @param tagName The name of the tag being used.
     * @returns A promise object that is either resolved when the tag is added
     * or rejected with an explanation if the tag couldn't be created or the
     * operation was cancelled by the user; in the latter case, the reason is
     * just null.
     */
    function onAddingNewTag(tagName) {
      if (ctrl.availTagNames.indexOf(tagName) !== -1) {
        return;
      }
      var confirm = $mdDialog.confirm()
        .title("Tag doesn't exist")
        .content("The tag '" + tagName + "' doesn't exist. Do you want to add it?")
        .ok('Yes')
        .cancel('No');
      // TODO: Use this if possible: .targetEvent(event);

      var deferred = $q.defer();
      $mdDialog.show(confirm).then(function onConfirm() {
        var tag = new HadithTag({name: tagName});
        tag.$save(function () {
          // The tag was successfully added so we add to the list of available
          // tags for auto completion.
          ctrl.availTagNames.push(tagName);
          deferred.resolve();
        }, function () {
          undoAddingTag(tagName);
          deferred.reject("Couldn't create tag. Please try again.");
        });
      }, function onCancel() {
        // User cancelled the operation.
        undoAddingTag(tagName);
        deferred.reject(null);
      });
      return deferred.promise;
    }

    function undoAddingTag(tagName) {
      var i;
      while ((i = ctrl.tagNames.indexOf(tagName)) !== -1) {
        ctrl.tagNames.splice(i, 1);
      }
    }

    ctrl.onAppend = function () {
      if (ctrl.allowAddingTags) {
        onAddingNewTag(ctrl.tagQuery);
      }
      return ctrl.tagQuery;
    };

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
      templateUrl: getHtmlBasePath() + 'directives/tagselector.directive.html',
      controller: 'TagSelectorCtrl',
      controllerAs: 'ctrl',
      bindToController: true,
      scope: {
        tagNames: '=',
        readOnly: '=',
        singleSelect: '=',
        allowAddingTags: '='
      }
    };

  });
}());