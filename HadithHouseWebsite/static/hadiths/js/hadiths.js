(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('HadithsCtrl',
    function ($scope, $location, $mdDialog) {
      var ctrl = this;

      ctrl.showAddHadithDialog = function (event) {
        $mdDialog.show({
          controller: 'AddHadithDialogCtrl',
          controllerAs: 'ctrl',
          templateUrl: getHtmlBasePath() + 'addhadithdlg.html',
          //parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true
        }).then(function onAdd(newHadith) {
        }, function onCancel() {
        });
      };
    });
}());