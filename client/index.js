angular.module('app', [
  'directives.ngEnter',
  'filters.letters',
  'ui.bootstrap',
  'modals.newGame',
  'modals.message'
])

.controller('MainCtrl', function($scope, $modal) {
  $scope.letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  $scope.points = 0;


  var openMessageModal = function(header, message, onSuccess) {
    onSuccess = onSuccess || function() {};
    var modalInstance = $modal.open({
      templateUrl: 'modals.message.html',
      controller: 'MessageCtrl',
      resolve: {
        message: function() {return message},
        header: function() {return header}
      }
    });
    modalInstance.result.then(onSuccess);
  };

  var openNewGameModal = function () {
    var modalInstance = $modal.open({
      templateUrl: 'modals.newGame.html',
      controller: 'NewGameCtrl'
    });

    modalInstance.result.then(function (word) {
      $scope.startNewGame(word);
    });
  };
  openNewGameModal();
  
  $scope.startNewGame = function(providedWord) {
    $scope.word = [];
    providedWord.split('').forEach(function(letter) {
      $scope.word.push({name: letter, guessed: false});
    });
    $scope.points = 0;
    $scope.gameLetters = $scope.letters.slice();
  };

  $scope.check = function(guess) {
    var letterIdx = $scope.gameLetters.indexOf(guess);
    $scope.gameLetters.splice(letterIdx, 1);
    var correct = false;
    $scope.word.forEach(function(letter) {
      if (letter.name === guess) {
        letter.guessed = true;
        correct = true;
      }
    });
    if (!correct) {
      $scope.points++;
      if ($scope.points === 6) {
        openMessageModal('Sorry', 'You lose', function() {
          openNewGameModal();
        });
      }
    }
    if (_.every($scope.word, function(letter) { return letter.guessed; })) {
      openMessageModal('Congratulations!', 'You won!', function() {
        openNewGameModal();
      });
    }
    $scope.guess = '';
  };
});
