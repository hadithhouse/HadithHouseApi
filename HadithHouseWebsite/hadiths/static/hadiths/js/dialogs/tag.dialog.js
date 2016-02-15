(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  function TagDialogCtrl($scope, $mdDialog, HadithTag, ToastService) {
    var ctrl = this;

    ctrl.isSaveMode = function () {
      return ctrl.locals && ctrl.locals.tag;
    };

    if (ctrl.isSaveMode()) {
      ctrl.tag = ctrl.locals.tag;
      ctrl.undoData = {
        name: ctrl.tag.name
      };
    } else {
      ctrl.tag = new HadithTag({
        name: ''
      });
    }

    ctrl.cancel = function () {
      $mdDialog.cancel();
    };

    ctrl.add = function () {
      ctrl.tag.$save(function onSuccess() {
        ToastService.show('Tag saved');
        $mdDialog.hide();
      }, function onError(result) {
        if (result.data && result.data.detail) {
          ToastService.show("Failed to save tag. Error was: " + result.data.detail);
        } else if (result.data) {
          ToastService.show("Failed to save tag. Error was: " + result.data);
        } else {
          ToastService.show("Failed to save tag. Please try again.");
        }

        if (ctrl.isSaveMode()) {
          ctrl.tag.name = ctrl.undoData.name;
        }
      });
    };
  }

  HadithHouseApp.controller('TagDialogCtrl', TagDialogCtrl);
}());
