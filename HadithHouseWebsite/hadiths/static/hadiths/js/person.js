(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('PersonCtrl',
    function ($mdDialog, $location, $routeParams, PersonsService, ToastService) {
      var ctrl = this;

      ctrl.error = false;

      // Is the user loading an existing person or adding a new one?
      ctrl.personId = $routeParams.personId;
      if (ctrl.personId === 'new') {
        // ...adding new person.
        ctrl.person = {
          title: '',
          display_name: '',
          full_name: '',
          brief_desc: '',
          birth_year: '',
          birth_month: '',
          birth_day: '',
          death_year: '',
          death_month: '',
          death_day: '',
        };
        ctrl.addingNew = true;
        ctrl.isEditing = true;
      } else {
        // ...loading an existing hadith.
        PersonsService.getPerson(ctrl.personId).then(function onSuccess(person) {
          ctrl.person = person;
        }, function onError() {

        });
        ctrl.addingNew = false;
        ctrl.isEditing = false;
      }

      var oldPerson = {};

      /**
       * Makes a copy of the data of the person in case we have to restore them
       * if the user cancels editing or we fail to send changes to the server.
       */
      function saveCopyOfPerson() {
        oldPerson.title = ctrl.person.title;
        oldPerson.display_name = ctrl.person.display_name;
        oldPerson.full_name = ctrl.person.full_name;
        oldPerson.brief_desc = ctrl.person.brief_desc;
        oldPerson.birth_year = ctrl.person.birth_year;
        oldPerson.birth_month = ctrl.person.birth_month;
        oldPerson.birth_day = ctrl.person.birth_day;
        oldPerson.death_year = ctrl.person.death_year;
        oldPerson.death_month = ctrl.person.death_month;
        oldPerson.death_day = ctrl.person.death_day;
      }

      /**
       * Restores the saved data of the person after the user cancels editing
       * or we fail to send changes to the server.
       */
      function restoreCopyOfPerson() {
        ctrl.person.title = oldPerson.title;
        ctrl.person.display_name = oldPerson.display_name;
        ctrl.person.full_name = oldPerson.full_name;
        ctrl.person.brief_desc = oldPerson.brief_desc;
        ctrl.person.birth_year = oldPerson.birth_year;
        ctrl.person.birth_month = oldPerson.birth_month;
        ctrl.person.birth_day = oldPerson.birth_day;
        ctrl.person.death_year = oldPerson.death_year;
        ctrl.person.death_month = oldPerson.death_month;
        ctrl.person.death_day = oldPerson.death_day;
      }

      /**
       * Called when the user clicks on the edit icon to start editing the person.
       */
      ctrl.startEditing = function() {
        saveCopyOfPerson();
        ctrl.isEditing = true;
      };

      function addNewPerson() {
        // Send the changes to the server.
        PersonsService.postPerson(ctrl.person).then(function onSuccess(result) {
          ctrl.person = result.data;
          $location.path('person/' + ctrl.person.id);
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ctrl.addingNew = false;
          ToastService.show("Person added.");
        }, function onFail(result) {
          if (result.data) {
            ToastService.show("Failed to add person. Error was: " + result.data);
          } else {
            ToastService.show("Failed to add person. Please try again.");
          }
        });
      }

      function saveCurrentPerson() {
        // Send the changes to the server.
        PersonsService.putPerson(ctrl.person).then(function onSuccess() {
          // Successfully saved changes. Don't need to do anything.
          ctrl.isEditing = false;
          ToastService.show("Changes saved.");
        }, function onFail(result) {
          // Failed to save the changes. Restore the old data and show a toast.
          ctrl.isEditing = false;
          restoreCopyOfPerson();
          if (result.data) {
            ToastService.show("Failed to save person. Error was: " + result.data);
          } else {
            ToastService.show("Failed to save person. Please try again.");
          }
        });
      }
      /**
       * Called when the user clicks on the save icon to save the changes made.
       */
      ctrl.finishEditing = function() {
        if (ctrl.addingNew) {
          addNewPerson();
        } else {
          saveCurrentPerson();
        }
      };

      /**
       * Called when the user clicks on the X icon to cancel the changes made.
       */
      ctrl.cancelEditing = function() {
        ctrl.isEditing = false;
      };
    });
}());