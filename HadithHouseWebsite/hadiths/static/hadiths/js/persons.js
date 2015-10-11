(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('PersonsCtrl',
    function ($mdDialog, PersonsService, ToastService) {
      var ctrl = this;

      ctrl.loadPersons = function() {
        PersonsService.getPersons().then(function onSuccess(persons) {
          ctrl.persons = persons;
        }, function onError() {
          // TODO: Show an alert.
        });
      };
      ctrl.loadPersons();

      ctrl.deletePerson = function (event, person) {
        var confirm = $mdDialog.confirm()
          .title('Confirm')
          .content('Are you sure you want to delete this person?')
          .ok('Yes')
          .cancel('No')
          .targetEvent(event);
        $mdDialog.show(confirm).then(function () {
          PersonsService.deletePerson(person.id).then(function onSuccess() {
            ToastService.show('Person deleted');
            ctrl.loadPersons();
          }, function onError() {
            ToastService.show("Couldn't delete person. Please try again!");
          });
        });
      };
    });
}());