(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('HadithCtrl',
    function ($mdDialog, $routeParams, HadithsService, ToastService) {
      var ctrl = this;
      ctrl.hadithId = $routeParams.hadithId;

      ctrl.error = false;

      function loadHadith() {
        HadithsService.getHadith(ctrl.hadithId).then(
          function onSuccess(hadith) {
            ctrl.hadith = hadith;
          },
          function onError() {
            ctrl.error = true;
          });
      }
      loadHadith();
    });
}());