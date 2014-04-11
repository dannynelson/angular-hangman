angular.module('modals.message', [])

.controller('MessageCtrl', function ($scope, $modalInstance, message, header) {
  debugger;
  $scope.message = message;
  $scope.header = header;
  $scope.close = function () {
    $modalInstance.close();
  };
});
