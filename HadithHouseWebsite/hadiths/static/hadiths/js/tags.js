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
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  function TagsCtrl($mdDialog, TagsService, ToastService) {
    var ctrl = this;

    ctrl.loadTags = function() {
      TagsService.getTags().then(function onSuccess(tags) {
        ctrl.tags = tags;
      }, function onError() {
        // TODO: Show an alert.
      });
    };
    ctrl.loadTags();

    ctrl.deleteTag = function (event, tag) {
      var confirm = $mdDialog.confirm()
        .title('Confirm')
        .content('Are you sure you want to delete this tag? It will be removed from all hadiths having it.')
        .ok('Yes')
        .cancel('No')
        .targetEvent(event);
      $mdDialog.show(confirm).then(function () {
        TagsService.deleteTag(tag.id).then(function onSuccess() {
          ToastService.show('Tag deleted');
          ctrl.loadTags();
        }, function onError(result) {
          if (result.data) {
            ToastService.show("Failed to delete tag. Error was: " + result.data);
          } else {
            ToastService.show("Failed to delete tag. Please try again!");
          }
        });
      });
    };

    ctrl.showAddTagDialog = function (event) {
      $mdDialog.show({
        bindToController: true,
        controller: 'AddTagDialogCtrl',
        controllerAs: 'ctrl',
        locals: {
          tag: null
        },
        templateUrl: getHtmlBasePath() + 'dialogs/addtag.dialog.html',
        //parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function onAdd(newTag) {
        ctrl.loadTags();
      }, function onCancel() {
      });
    };

    ctrl.showEditTagDialog = function (event, tag) {
      $mdDialog.show({
        bindToController: true,
        controller: 'AddTagDialogCtrl',
        controllerAs: 'ctrl',
        locals: {
          tag: tag
        },
        templateUrl: getHtmlBasePath() + 'dialogs/addtag.dialog.html',
        //parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function onSave(newTag) {
        ctrl.loadTags();
      }, function onCancel() {
      });
    };
  }

  HadithHouseApp.controller('TagsCtrl', TagsCtrl);
}());