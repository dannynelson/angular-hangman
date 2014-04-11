angular.module('filters.letters', [])

.filter('letters', function() {
  return function(word) {
    return word.split('');
  };
});
