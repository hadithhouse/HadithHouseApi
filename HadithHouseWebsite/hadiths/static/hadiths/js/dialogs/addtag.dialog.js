(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  function AddTagDialogCtrl($scope, $mdDialog, TagsService, ToastService) {
    var ctrl = this;

    ctrl.newTag = {
      name: ''
    };

    ctrl.isSaveMode = function() {
      return ctrl.locals && ctrl.locals.tag;
    };

    if (ctrl.isSaveMode()) {
      ctrl.newTag.id = ctrl.locals.tag.id;
      ctrl.newTag.name = ctrl.locals.tag.name;
    }

    ctrl.cancel = function () {
      $mdDialog.cancel();
    };

    ctrl.add = function () {
      var newTag = {
        id: ctrl.newTag.id,
        name: ctrl.newTag.name
      };
      if (ctrl.isSaveMode()) {
        TagsService.putTag(newTag).then(function onSuccess() {
          ToastService.show('Tag saved');
          $mdDialog.hide(newTag);
        }, function onError() {
          ToastService.show("Couldn't save tag! Please try again.");
        });
      } else {
        TagsService.postTag(newTag).then(function onSuccess() {
          ToastService.show('Tag added');
          $mdDialog.hide(newTag);
        }, function onError() {
          ToastService.show("Couldn't add tag! Please try again.");
        });
      }

    };
  }

  HadithHouseApp.controller('AddTagDialogCtrl', AddTagDialogCtrl);
}());
