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

      ctrl.showAddHadithDialog = function (event) {
        $mdDialog.show({
          bindToController: true,
          controller: 'AddHadithDialogCtrl',
          controllerAs: 'ctrl',
          locals: {
            hadith: null
          },
          templateUrl: getHtmlBasePath() + 'addhadithdlg.html',
          //parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true
        }).then(function onAdd(newHadith) {
          ctrl.loadHadiths();
        }, function onCancel() {
        });
      };

      ctrl.showEditHadithDialog = function (event, hadith) {
        $mdDialog.show({
          bindToController: true,
          controller: 'AddHadithDialogCtrl',
          controllerAs: 'ctrl',
          locals: {
            hadith: hadith
          },
          templateUrl: getHtmlBasePath() + 'addhadithdlg.html',
          //parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true
        }).then(function onSave(newHadith) {
          ctrl.loadHadiths();
        }, function onCancel() {
        });
      };
    });
}());