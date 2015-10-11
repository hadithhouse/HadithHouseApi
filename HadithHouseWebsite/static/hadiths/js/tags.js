(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  function TagsCtrl($scope, $location, $mdDialog, TagsService) {
    var ctrl = this;

    TagsService.getTags().then(function onSuccess(tags) {
      ctrl.tags = tags;
    }, function onError() {
      // TODO: Show an alert.
    })

    ctrl.showAddTagDialog = function (event) {
      $mdDialog.show({
        controller: 'AddTagDialogCtrl',
        controllerAs: 'ctrl',
        templateUrl: getHtmlBasePath() + 'addtagdlg.html',
        //parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true
      }).then(function onAdd(newTag) {
      }, function onCancel() {
      });
    };
  }

  HadithHouseApp.controller('TagsCtrl', TagsCtrl);
}());