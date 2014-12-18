app = angular.module('myApp', []);

app.controller('MainCtrl', function ($scope) {

  $scope.data = (function makeData() {
    var data = [];

    for(i = 1; i <= 100; i++) {
      var point = {};

      point.x = Math.floor(Math.random() * 50);
      point.y = Math.floor(Math.random() * 100);

      data.push(point);
    }

    return data;

  }())

  $scope.shuffle = function () {
    (function makeData() {
      var data = [];

      for(i = 1; i <= 100; i++) {
        var point = {};

        point.x = Math.floor(Math.random() * 50);
        point.y = Math.floor(Math.random() * 100);

        data.push(point);
      }

      $scope.data = data;
      console.log($scope.data);
    }())  
  }
});

app.directive('plottableScatter', function (){

 function getXData(d) {
    return d.x;
  }

  function getYData(d) {
    return d.y;
  }

  function makeChart(data, target) {
    var xScale = new Plottable.Scale.Linear();
    var yScale = new Plottable.Scale.Linear();

    var xAxis = new Plottable.Axis.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axis.Numeric(yScale, "left");

    var plot = new Plottable.Plot.Scatter(xScale, yScale);

    plot.addDataset(data);
    plot.project('x', getXData, xScale);
    plot.project('y', getYData, yScale);

    var chart = new Plottable.Component.Table([
        [yAxis, plot],
        [null, xAxis]
      ]);

    chart.renderTo(target);
    return plot;
  }

  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    replace: true,
    template: '<svg height="480" width="640"/>',
    link: function postLink(scope, elem, attrs) {
      var chartContainer = elem[0];


      var plot = makeChart(scope.data, chartContainer);

      scope.$watch('data', function (newVal, oldVal) {
        
        if (newVal === oldVal) {
          return
        } else {
          plot.remove();  
          makeChart(scope.data, chartContainer); 
        }
      })
    }
  };
});