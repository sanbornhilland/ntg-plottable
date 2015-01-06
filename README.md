#ntg-plottable
=============

##Angular Wrapper for plottable.js

Wraps the plottables.js library for use in Angular applications. 


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

`data="someData"`
Required

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

`axis-x="xVal"` and `axis-y="yVal"`
Required

Specify which property of each point object will be used as the X values and which property will be used as the Y Values.


####Dimensions

`height="500"` and `width="500"`
Optional

Set the height and width of the chart. `height` defaults to 480 and `width` defaults to 640.


###Optional Attributes

####Regressions

`regression="linear"`
Optional for scatter charts

Add a regression line to the chart by specifying which type of regression to display. Currently only supporting linear regression.

