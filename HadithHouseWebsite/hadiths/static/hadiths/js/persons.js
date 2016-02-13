(function() {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('PersonsCtrl',
    function ($scope, $rootScope, $mdDialog, PersonsService, ToastService) {
      var ctrl = this;

      $scope.$watch(function () { return $rootScope.user; }, function () {
        ctrl.user = $rootScope.user;
      });

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
          }, function onError(result) {
            if (result.data && result.data.detail) {
              ToastService.show("Failed to delete person. Error was: " + result.data.detail);
            } else if (result.data) {
              ToastService.show("Failed to delete person. Error was: " + result.data);
            } else {
              ToastService.show("Failed to delete person. Please try again!");
            }
          });
        });
      };
    });
}());