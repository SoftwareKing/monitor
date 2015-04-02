(function(angular){

angular.module('util.filters', [])
.filter('loop', function() {
  return function(input,start,end,step) {
    start = parseInt(start);
    end = parseInt(end);
    step = parseInt(step);
    for (var i=start; i<=end; i=i+step)
      input.push(i);
    return input;
  };
});

})(angular);