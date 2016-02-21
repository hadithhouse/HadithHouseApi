(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('HadithsCtrl',
    function ($scope, $rootScope, $mdDialog, HadithResource, ToastService) {
      var ctrl = this;

      $scope.$watch(function () { return $rootScope.user; }, function () {
        ctrl.user = $rootScope.user;
      });

      ctrl.loadHadiths = function() {
        HadithResource.query(function onSuccess(hadiths) {
          ctrl.hadiths = hadiths;
        }, function onError() {
          // TODO: Show an alert.
        });
      };
      ctrl.loadHadiths();

      ctrl.deleteHadith = function (event, hadith) {
        var confirm = $mdDialog.confirm()
          .title('Confirm')
          .content('Are you sure you want to delete this hadith? It will be removed from all hadiths having it.')
          .ok('Yes')
          .cancel('No')
          .targetEvent(event);
        $mdDialog.show(confirm).then(function () {
          HadithResource.delete({id: hadith.id}, function onSuccess() {
            ToastService.show('Hadith deleted');
            ctrl.loadHadiths();
          }, function onError(result) {
            if (result.data) {
              ToastService.showDjangoError("Failed to delete hadith.", result.data);
            } else {
              ToastService.show("Failed to delete hadith. Please try again!");
            }
          });
        });
      };
    });
}());