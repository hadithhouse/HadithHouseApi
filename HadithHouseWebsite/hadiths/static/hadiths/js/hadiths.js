(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('HadithsCtrl',
    function ($mdDialog, HadithsService, ToastService) {
      var ctrl = this;

      ctrl.loadHadiths = function() {
        HadithsService.getHadiths().then(function onSuccess(hadiths) {
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
          HadithsService.deleteHadith(hadith.id).then(function onSuccess() {
            ToastService.show('Hadith deleted');
            ctrl.loadHadiths();
          }, function onError() {
            ToastService.show("Couldn't delete hadith. Please try again!");
          });
        });
      };
    });
}());