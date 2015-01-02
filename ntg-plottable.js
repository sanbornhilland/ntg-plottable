app = angular.module('myApp', []);

app.controller('MainCtrl', function ($scope) {
  var counter = 1;

  $scope.data = (function makeData() {
    var data = [];

    for(i = 1; i <= 100; i++) {
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

      for(i = 1; i <= 100; i++) {
        var point = {};

        point.purple = Math.floor(Math.random() * 50);
      point.blue = Math.floor(Math.random() * 100);

        data.push(point);
      }

      $scope.data = data;
      console.log($scope.data);
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

app.directive('plottableScatter', function (){

  // function getXData(d) {
  //   return d.x;
  // }

  // function getYData(d) {
  //   return d.y;
  // }

  function getXData(property) {
    return function (d) {
      return d[property]
    }
  }

  function getYData(property) {
    return function (d) {
      return d[property]
    }
  }
  /*
   * Takes an array of points as objects and returns an
   * array of points as arrays.
   */
  function convertPointObjectsToArrays(data, x, y) {
    var pointArrays = []

    for (i = 0; i < data.length; i++) {
      var pointObject = data[i];
      var pointArray = new Array(pointObject[x], pointObject[y]);

      pointArrays.push(pointArray);
    }

    return pointArrays;
  }

  /*
   * Takes an array of points as arrays and returns an array
   * of points as objects.
   */
  function convertPointArraysToObjects(data, x, y) {
    var pointObjects = [];

    for(i = 0; i < data.length; i++) {
      var point = {};

      point[x] = data[i][0];
      point[y] = data[i][1];

      pointObjects.push(point);
    }

    return pointObjects;
  }

  /*
   * Rename regression library to avoid name collisions
   */
  _regression = regression;

  function getRegressionData(regressionType, data, scope) {
    var arrayedRegressionData = _regression(regressionType, convertPointObjectsToArrays(data, scope.axisX, scope.axisY)).points;
    return convertPointArraysToObjects(arrayedRegressionData, scope.axisX, scope.axisY);  
  }

  function makeChart(data, chartContainer, scope) {
    var xScale = new Plottable.Scale.Linear();
    var yScale = new Plottable.Scale.Linear();

    var xAxis = new Plottable.Axis.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axis.Numeric(yScale, "left");

    var plot = new Plottable.Plot.Scatter(xScale, yScale);

    plot.addDataset(data);
    plot.project('x', getXData(scope.axisX), xScale);
    plot.project('y', getYData(scope.axisY), yScale);

    var chart = new Plottable.Component.Table([
        [yAxis, plot],
        [null, xAxis]
      ]);

    chart.renderTo(chartContainer);
    return {
      chart: chart,
      xScale: xScale,
      yScale: yScale,
      xAxis: xAxis,
      yAxis: yAxis
    }
  }

  function makeRegressionLine(regressionType, originalData, xAxis, yAxis, xScale, yScale, target, scope) {
    var regressionData = getRegressionData(regressionType, originalData, scope);
    var plot = new Plottable.Plot.Line(xScale, yScale);

    plot.addDataset(regressionData);

    plot.project('x', getXData(scope.axisX), xScale);
    plot.project('y', getYData(scope.axisY), yScale);

    var regressionChart = new Plottable.Component.Table([
        [yAxis, plot],
        [null, xAxis]
      ])

    regressionChart.renderTo(target);
    return regressionChart;
  }

  return {
    restrict: 'E',
    scope: {
      data: '=',
      regression: '@',
      axisX: '@',
      axisY: '@'
    },
    replace: true,
    template: '<svg height="480" width="640"/>',
    link: function postLink(scope, elem, attrs) {
      var chartContainer = elem[0],
          regressionType = scope.regression;
          regression;

      var chartAttrs = makeChart(scope.data, chartContainer, scope);
      
      if (regressionType) {
        regression = makeRegressionLine(regressionType, scope.data, chartAttrs.xAxis, chartAttrs.yAxis, chartAttrs.xScale, chartAttrs.yScale, chartContainer, scope);  
      }
      
      scope.$watch('data', function (newVal, oldVal) {      
        if (newVal === oldVal) { // Block against initial firing on registration
          return
        } else {
          chartAttrs.chart.remove();  
          chartAttrs = makeChart(scope.data, chartContainer, scope); 

          if (scope.regression) {
            regression.remove();
            regression = makeRegressionLine(regressionType, scope.data, chartAttrs.xAxis, chartAttrs.yAxis, chartAttrs.xScale, chartAttrs.yScale, chartContainer, scope);  
          }
        }
      }, true)
    }
  };
});