#ntg-plottable
=============

##Angular Wrapper for plottable.js

Wraps the plottables.js library for use in Angular applications. 

###Installation

1. run `bower install ntg-plottable`
2. Include ntg-plottable.js, d3.js, regressions.js, plottable.js and plottable.css in your index file
3. Inject the `ntgPlottable` module into your Angular application


###Currently Available Directives:

1. `<plottable-scatter>`
2. `<plottable-line>`
3. `<plottable-vertical-bar>`
4. `<plottable-horizontal-bar>`
5. `<plottable-stacked-area>`
6. `<plottable-stacked-bar>`

Note: many of these are still in development so though they are available directives, they might not behave as expected.


## API Reference

###Example Usage

Ex: `<plottable-scatter data="someData" axis-x"xData" axis-y"yData"></plottable-scatter>`


###Standard Attributes

####Data

Required
`data="someData"`
}
The value of someData should be the data you want to chart, represented as an array of point objects such as:

```
someData = [
  {'xVal': 1, 'yVal': 2},
  {'xVal': 10, 'yVal': 22},
  {'xVal': 9, 'yVal': 6},
  {'xVal': 14, 'yVal': 17}
  ...
]
```

Note, the property names do no matter as long as they are consistent. You will specify which property to use on which axis using the `axis-x` and `axis-y` attributes.


####X and Y Data
Required

`axis-x="xVal"` and `axis-y="yVal"`


Specify which property of each point object will be used as the X values and which property will be used as the Y Values.


###Optional Attributes

####Regressions
Optional for scatter charts

`regression="linear"`

Add a regression line to the chart by specifying which type of regression to display. Currently only supporting linear regression.

####Dimensions
Optional for all charts

`height="500"` and `width="500"`


Set the height and width of the chart. `height` defaults to 480 and `width` defaults to 640.

