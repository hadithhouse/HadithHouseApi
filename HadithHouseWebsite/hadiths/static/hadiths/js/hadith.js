(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('HadithCtrl',
    function ($scope, $rootScope, $mdDialog, $location, $routeParams, HadithsService, ToastService) {
      var ctrl = this;

      $scope.$watch(function () { return $rootScope.user; }, function () {
        ctrl.user = $rootScope.user;
      });

      // Is the user loading an existing hadith or adding a new one?
      ctrl.hadithId = $routeParams.hadithId;
      if (ctrl.hadithId === 'new') {
        // ...adding new hadith.
        ctrl.hadith = {
          text: '',
          book: null,
          person: 1,
          tags: []
        };
        ctrl.addingNew = true;
        ctrl.isEditing = true;
      } else {
        // ...loading an existing hadith.
        HadithsService.getHadith(ctrl.hadithId).then(function onSuccess(hadith) {
          ctrl.hadith = hadith;
        }, function onError() {

        });
        ctrl.addingNew = false;
        ctrl.isEditing = false;
      }

      ctrl.error = false;

      var oldHadith = {};

      /**
       * Makes a copy of the data of the hadith in case we have to restore them
       * if the user cancels editing or we fail to send changes to the server.
       */
      function saveCopyOfHadith() {
        oldHadith.text = ctrl.hadith.text;
        oldHadith.person = ctrl.hadith.person;
        oldHadith.book = ctrl.hadith.book;
        oldHadith.tags = ctrl.hadith.tags.slice();
      }

      /**
       * Restores the saved data of the hadith after the user cancels editing
       * or we fail to send changes to the server.
       */
      function restoreCopyOfHadith() {
        ctrl.hadith.text = oldHadith.text;
        ctrl.hadith.person = oldHadith.person;
        ctrl.hadith.book = oldHadith.book;
        ctrl.hadith.tags = oldHadith.tags.slice();
      }

      /**
       * Called when the user clicks on the edit icon to start editing the hadith.
       */
      ctrl.startEditing = function() {
        saveCopyOfHadith();
        ctrl.isEditing = true;
      };

      /**
       * Called by finishEditing() for the case of adding a new hadith.
       */
      function addNewHadith() {
        // Send the changes to the server.
        HadithsService.postHadith(ctrl.hadith).then(function onSuccess(result) {
          ctrl.hadith = result.data;
          $location.path('hadith/' + ctrl.hadith.id);
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ctrl.addingNew = false;
          ToastService.show("Hadith added.");
        }, function onFail(result) {
          if (result.data) {
            ToastService.showDjangoError("Failed to add hadith.", result.data);
          } else {
            ToastService.show("Failed to add hadith. Please try again.");
          }
        });
      }

      /**
       * Called by finishEditing() for the case of saving an already existing hadith.
       */
      function saveCurrentHadith() {
        // Send the changes to the server.
        HadithsService.putHadith(ctrl.hadith).then(function onSuccess() {
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ToastService.show("Changes saved.");
        }, function onFail(result) {
          // Failed to save the changes. Restore the old data and show a toast.
          ctrl.cancelEditing();
          if (result.data) {
            ToastService.showDjangoError("Failed to save hadith.", result.data);
          } else {
            ToastService.show("Failed to save hadith. Please try again.");
          }
        });
      }

      /**
       * Called when the user clicks on the save icon to save the changes made.
       */
      ctrl.finishEditing = function() {
        if (!ctrl.validateHadith()) {
          return;
        }
        if (ctrl.addingNew) {
          addNewHadith();
        } else {
          saveCurrentHadith();
        }
      };

      /**
       * Validates that the data the user put is valid; otherwise, show a toast.
       * @returns {boolean} True or false.
       */
      ctrl.validateHadith = function() {
        if (ctrl.hadith.person == null) {
          ToastService.show("Please choose a person.");
          return false;
        }
        if (ctrl.hadith.tags.length === 0) {
          ToastService.show("Please choose at least one tag.");
          return false;
        }
        return true;
      };

      /**
       * Called when the user clicks on the X icon to cancel the changes made.
       */
      ctrl.cancelEditing = function() {
        ctrl.isEditing = false;
        restoreCopyOfHadith();
      };
    });
}());