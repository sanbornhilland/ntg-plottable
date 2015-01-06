var app = angular.module('myApp', ['ntgPlottable']);

app.controller('MainCtrl', function ($scope) {
  var counter = 1;

  $scope.data = (function makeData() {
    var data = [];

    for(i = 1; i <= 200; i++) {
      var point = {};

      point.purple = Math.floor(Math.random() * 50);
      point.blue = Math.floor(Math.random() * 100);
      // point.x = counter++;
      // point.y = counter++;

      data.push(point);
    }

    return data;

  }())

  $scope.shuffle = function () {
    (function makeData() {
      var data = [];

      for(i = 1; i <= 200; i++) {
        var point = {};

        point.purple = Math.floor(Math.random() * 50);
        point.blue = Math.floor(Math.random() * 100);

        data.push(point);
      }

      $scope.data = data;
    }())  
  }

  $scope.increase = function () {
    for(var i = 0; i < 50; i++) {
      $scope.data[i].x++;
      $scope.data[i].y++;
    }
  }

  $scope.decrease = function () {
   for(var i = 0; i < 50; i++) {
      $scope.data[i].x--;
      $scope.data[i].y--;
    }
  }
});
