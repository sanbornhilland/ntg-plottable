'use strict'

var plottableModule = angular.module('ntgPlottable', []);

plottableModule.factory('plottableService', function () {
  /*
   * Rename regression library to avoid name collisions
   */
  var _regression = regression;

  /*
   * Return an accessor for a given property on some data point
   */
  function dataAccessor(property) {
    return function (d) {
      return d[property];
    }
  }

  /*
   * Takes an array of points as objects and returns an
   * array of points as arrays.
   */
  function convertPointObjectsToArrays(data, x, y) {
    var pointArrays = []

    for (var i = 0; i < data.length; i++) {
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

    for(var i = 0; i < data.length; i++) {
      var point = {};

      point[x] = data[i][0];
      point[y] = data[i][1];

      pointObjects.push(point);
    }

    return pointObjects;
  }

  /* 
   * Regression.js requires points to be stored as arrays so we must convert 
   * points as objects to arrays to calculate the regression and then back to
   * objects to be handled by plottable.js
   */
  function getRegressionData(regressionType, scope) {
    var arrayedRegressionData = _regression(regressionType, convertPointObjectsToArrays(scope.data, scope.axisX, scope.axisY)).points;
    return convertPointArraysToObjects(arrayedRegressionData, scope.axisX, scope.axisY);  
  }

  /*
   * Return a new Plottable Plot of the correct type
   */
  var getNewPlot = function (xScale, yScale, type) {
    var plots = {
      scatter: new Plottable.Plot.Scatter(xScale, yScale),
      line: new Plottable.Plot.Line(xScale, yScale),
      verticalBar: new Plottable.Plot.VerticalBar(xScale, yScale),
      horizontalBar: new Plottable.Plot.HorizontalBar(xScale, yScale),
      stackedArea: new Plottable.Plot.StackedArea(xScale, yScale),
      stackedBar: new Plottable.Plot.StackedBar(xScale, yScale)
    }

    return plots[type];
  }

  /*
   * Return an object with a new x and y scale.
   */
  function makeLinearScales() {
    var scales = {
      x: new Plottable.Scale.Linear(),
      y: new Plottable.Scale.Linear()
    }

    return scales;
  }

  /*
   * Return an object with a new x and y axis.
   */
  function makeAxes(scales) {
    var axes = {
      x: new Plottable.Axis.Numeric(scales.x, "bottom"),
      y: new Plottable.Axis.Numeric(scales.y, "left")
    }

    return axes;
  }

  function makeChart(scope, chartContainer, type) {
    var scales = makeLinearScales(),
        axes = makeAxes(scales),
        colorScale = new Plottable.Scale.Color(),
        plot = getNewPlot(scales.x, scales.y, type),
        title,
        subtitle;

    if (scope.title) {
      title = new Plottable.Component.TitleLabel(scope.title);
    }

    if (scope.subtitle) {
      subtitle = new Plottable.Component.Label(scope.subtitle);
    }

    var titleTable = new Plottable.Component.Table([
                      [title],
                      [subtitle]
                    ]);
    titleTable.xAlign("center");



    plot.addDataset(scope.data)
        .project('x', dataAccessor(scope.axisX), scales.x)
        .project('y', dataAccessor(scope.axisY), scales.y)
        .project('fill', function () {return 'bottom';}, colorScale);

    var dataTable = new Plottable.Component.Table([
        [axes.y, plot],
        [null, axes.x]
      ]);

    var chart = new Plottable.Component.Table([
                [titleTable],
                [dataTable]
              ])

    chart.renderTo(chartContainer);

    /*
     * Create a regression function to draw a regression line for the current chart
     * which will be returned and called later if a regression was specified
     */
    function regressionFunction(regressionType) {
      var regressionData = getRegressionData(regressionType, scope),
          plot = new Plottable.Plot.Line(scales.x, scales.y);

      plot.addDataset(regressionData)
          .project('x', dataAccessor(scope.axisX), scales.x)
          .project('y', dataAccessor(scope.axisY), scales.y)
          .project('stroke', function () {return 'left';}, colorScale);

      var regressionChart = new Plottable.Component.Table([
          [axes.y, plot],
          [null, axes.x]
        ])

      regressionChart.renderTo(chartContainer);
      return regressionChart;
    }

    return {
      renderedChart: chart,
      drawRegression: regressionFunction
    }
  };

  function postLink(type) {
    return function (scope, elem, attrs) {
      var chartContainer = elem[0],
          regressionType = scope.regression,
          chart,
          regression;

      chart = pService.makeChart(scope, chartContainer, type);
      regression = regressionType && chart.drawRegression(regressionType);  
      
      /*
       * Watch the data for changes and update the chart if any data changes.
       */
      scope.$watch('data', function (newVal, oldVal) {      
        if (newVal === oldVal) { // Block against initial firing on registration
          return
        } else {
          chart.renderedChart.remove();  
          chart = pService.makeChart(scope, chartContainer, type); 

          if (scope.regression) {
            regression.remove();
            regression = chart.drawRegression(regressionType);  
          }
        }
      }, true)
    }
  };

  var pService = {
    makeChart: makeChart,
    postLink: postLink
  };

  return pService;
});

/*
 * A factory with a single method on it for creating new directive definition objects with
 * base properties used by all directives. The Directive Definition function takes a string as an
 * argument, indicating what time of chart to build.
 */
plottableModule.factory('directiveDefinitionFactory', ['plottableService', function (plottableService) {

  function generateTemplate(tElement, tAttrs) {
   var height = tAttrs.height || 480;
   var width  = tAttrs.width  || 640;
   
   return '<svg height="' + height + '" width="' + width + '"/>'; 
  }

  var dDFactory = {
    DirectiveDefinition: function (type) {
      this.restrict = 'E';
      this.replace = true;
      this.template = generateTemplate;
      this.scope = {
        data: '=',
        axisX: '@',
        axisY: '@',
        title: '@',
        subtitle: '@'
      }
      this.link = plottableService.postLink(type);
    }
  };

  return dDFactory;
}]);

plottableModule.directive('plottableScatter', ['directiveDefinitionFactory', function (directiveDefinitionFactory) {

  var directiveDefinition = new directiveDefinitionFactory.DirectiveDefinition('scatter');
      directiveDefinition.scope.regression = '@';

  return directiveDefinition;
}]);

plottableModule.directive('plottableLine', ['directiveDefinitionFactory', function (directiveDefinitionFactory) {
  return new directiveDefinitionFactory.DirectiveDefinition('line');
}]);

plottableModule.directive('plottableVerticalBar', ['directiveDefinitionFactory', function (directiveDefinitionFactory) {
  return new directiveDefinitionFactory.DirectiveDefinition('verticalBar');
}]);

plottableModule.directive('plottableHorizontalBar', ['directiveDefinitionFactory', function (directiveDefinitionFactory) {
  return new directiveDefinitionFactory.DirectiveDefinition('horizontalBar');
}]);

plottableModule.directive('plottableStackedArea', ['directiveDefinitionFactory', function (directiveDefinitionFactory) {
  return new directiveDefinitionFactory.DirectiveDefinition('stackedArea');
}]);

plottableModule.directive('plottableStackedBar', ['directiveDefinitionFactory', function (directiveDefinitionFactory) {
  return new directiveDefinitionFactory.DirectiveDefinition('stackedBar');
}]);