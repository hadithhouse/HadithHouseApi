(function () {
  'use strict';

  var HadithHouseApp = angular.module('HadithHouseApp');

  HadithHouseApp.controller('PermissionsCtrl',
    function ($scope, $rootScope) {
      var ctrl = this;

      $scope.$watch(function () {
        return $rootScope.user;
      }, function () {
        if (!$rootScope.user) {
          return;
        }

        ctrl.user = $rootScope.user;
        ctrl.userPermissions = _.map(ctrl.user.permissions, function (value, key) {
          return {
            name: key,
            displayName: _.startCase(key),
            value: value
          };
        });
      });

    });
}());