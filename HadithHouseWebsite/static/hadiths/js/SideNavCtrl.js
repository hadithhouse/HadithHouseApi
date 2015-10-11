(function () {

  angular
    .module('HadithHouseApp')
    .controller('SideNavCtrl', [
      '$scope', '$mdSidenav',
      SideNavCtrl
    ]);

  function SideNavCtrl($scope, $mdSidenav) {
    var self = this;

    // Load all registered items
    self.items = [
      {
        name: 'Hadiths'
      }
    ];
    self.selected = self.items[0];

    $scope.$on('toggleSideNav', function () {
      toggleItemsList();
    });

    function toggleItemsList() {
      $mdSidenav('left').toggle();
    }

    self.selectItem = function(item) {
      self.selected = angular.isNumber(item) ? $scope.items[item] : item;
      toggleItemsList;
    }
  }
})();
