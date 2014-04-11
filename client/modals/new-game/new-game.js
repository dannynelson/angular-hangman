angular.module('modals.newGame', [])

.controller('NewGameCtrl', function ($scope, $modalInstance) {
  $scope.submit = function (word) {
    $modalInstance.close(word);
  };
});
