(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('HadithCtrl',
    function ($mdDialog, $routeParams, $resource, HadithsService, ToastService) {
      var Hadith = $resource(getApiUrl() + 'hadiths/:hadithId');

      var ctrl = this;

      // Make a request to load the hadith.
      ctrl.hadithId = $routeParams.hadithId;
      ctrl.hadith = Hadith.get({hadithId: ctrl.hadithId}, function() {
        ctrl = ctrl;
      });

      ctrl.error = false;

      var oldHadith = {};

      /**
       * Makes a copy of the data of the hadith in case we have to restore them
       * if the user cancels editing or we fail to send changes to the server.
       */
      function saveCopyOfHadith() {
        oldHadith.text = ctrl.hadith.text;
        oldHadith.person = ctrl.hadith.person;
        oldHadith.tags = ctrl.hadith.tags.slice();
      }

      /**
       * Restores the saved data of the hadith after the user cancels editing
       * or we fail to send changes to the server.
       */
      function restoreCopyOfHadith() {
        ctrl.hadith.text = oldHadith.text;
        ctrl.hadith.person = oldHadith.person;
        ctrl.hadith.tags = oldHadith.tags.slice();
      }

      ctrl.isEditing = false;

      /**
       * Called when the user clicks on the edit icon to start editing the hadith.
       */
      ctrl.startEditing = function() {
        saveCopyOfHadith();
        ctrl.isEditing = true;
      };

      /**
       * Called when the user clicks on the save icon to save the changes made.
       */
      ctrl.finishEditing = function() {
        // Send the changes to the server.
        HadithsService.putHadith(ctrl.hadith).then(function onSuccess() {
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ToastService.show("Changes saved.");
        }, function onFail() {
          // Failed to save the changes. Restore the old data and show a toast.
          ctrl.isEditing = false;
          restoreCopyOfHadith();
          ToastService.show("Failed to save hadith. Please try again.");
        });
      };

      /**
       * Called when the user clicks on the X icon to cancel the changes made.
       */
      ctrl.cancelEditing = function() {
        ctrl.isEditing = false;
      };
    });
}());